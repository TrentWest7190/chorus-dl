import { ipcMain, BrowserWindow } from 'electron'
import { download } from 'electron-dl'
import unzipper from 'unzipper'
import fs from 'fs-extra'
import unrar from '@fknop/node-unrar'

import Store from 'common/electronStore'
import { replacer } from 'common/saveFormatParser'

ipcMain.on('request-download', async (ev, arg) => {
  const isArchived = arg.directLinks.archive !== undefined
  const libraryPath = Store.get('library')
  const parsedSaveFormat = replacer(Store.get('saveFormat'), arg).replace(/:/g, '꞉')

  const sendComplete = () => {
    const dlCache = Store.get('dlCache', [])
    Store.set('dlCache', [...dlCache, arg.hashes.file])
    ev.sender.send('download-complete', {
      id: arg.id,
      hash: arg.hashes.file,
    })
  }

  if (isArchived) {
    download(BrowserWindow.getFocusedWindow(), arg.directLinks.archive, {
      directory: libraryPath,
      onStarted: () => ev.sender.send('download-started', arg.id),
    }).then(dl => {
      const zipSavePath = dl.getSavePath()
      const zipFilename = dl.getFilename()
      const resultFolderName = zipFilename.slice(0, -4)
      const tempUnpkgFolder = `${libraryPath}\\&CHORUSDLTEMP&`
      fs.mkdirsSync(tempUnpkgFolder)

      if (zipFilename.match(/\.rar$/)) {
        unrar
          .extract(zipSavePath, {
            openMode: 1,
            dest: tempUnpkgFolder,
          })
          .then(res => fs.move(`${tempUnpkgFolder}\\${resultFolderName}`, `${libraryPath}\\${parsedSaveFormat}`))
          .then(() => fs.remove(zipSavePath))
          .then(sendComplete)
      } else {
        const unzipwritestream = unzipper.Extract({
          path: tempUnpkgFolder,
        })
        fs.createReadStream(zipSavePath).pipe(
          unzipwritestream,
          { end: true },
        )

        unzipwritestream.on('close', () => {
          fs.move(`${tempUnpkgFolder}\\${resultFolderName}`, `${libraryPath}\\${parsedSaveFormat}`)
          .then(() => fs.remove(zipSavePath))
          .then(sendComplete)
        })
      }
    })
  } else {
    for (const key in arg.directLinks) {
      ev.sender.send('download-started', arg.id)
      await download(BrowserWindow.getFocusedWindow(), arg.directLinks[key], {
        directory: `${libraryPath}\\${parsedSaveFormat}`,
        filename: getTrueName(key),
        saveAs: false,
      })
    }
    sendComplete()
  }
})

function getTrueName(file) {
  if (file === 'ini') return 'song.ini'
  if (file === 'mid') return 'notes.mid'
  if (file === 'chart') return 'notes.chart'
  return file
}
