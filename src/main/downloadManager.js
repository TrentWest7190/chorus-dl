import { ipcMain, BrowserWindow } from 'electron'
import { download } from 'electron-dl'
import unzipper from 'unzipper'
import fs from 'fs-extra'
import unrar from '@fknop/node-unrar'

import Store from 'common/electronStore'

ipcMain.on('request-download', async (ev, arg) => {
  const isArchived = arg.directLinks.archive !== undefined
  const libraryPath = Store.get('library')

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

      if (dl.getFilename().match(/\.rar$/)) {
        unrar
          .extract(zipSavePath, {
            openMode: 1,
            dest: `${libraryPath}`,
          })
          .then(res => {
            fs.remove(zipSavePath).then(sendComplete)
          })
      } else {
        const unzipwritestream = unzipper.Extract({
          path: libraryPath,
        })
        fs.createReadStream(zipSavePath).pipe(
          unzipwritestream,
          { end: true },
        )

        unzipwritestream.on('close', () => {
          fs.remove(zipSavePath).then(sendComplete)
        })
      }
    })
  } else {
    for (const key in arg.directLinks) {
      ev.sender.send('download-started', arg.id)
      await download(BrowserWindow.getFocusedWindow(), arg.directLinks[key], {
        directory: `${libraryPath}\\${arg.artist} - ${arg.name}`,
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
