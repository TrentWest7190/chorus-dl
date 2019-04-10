import { ipcMain, BrowserWindow } from 'electron'
import { download } from 'electron-dl'
import unzipper from 'unzipper'
import fs from 'fs-extra'
import unrar from '@fknop/node-unrar'

import Store from './electronStore'

ipcMain.on('request-download', async (ev, arg) => {
  const isArchived = arg.directLinks.archive !== undefined
  const libraryPath = Store.get('library')

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
            fs.remove(zipSavePath).then(() =>
              ev.sender.send('download-complete', arg.id),
            )
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
          fs.remove(zipSavePath).then(() =>
            ev.sender.send('download-complete', arg.id),
          )
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
    ev.sender.send('download-complete', arg.id)
  }
})

function getTrueName(file) {
  if (file === 'ini') return 'song.ini'
  if (file === 'mid') return 'notes.mid'
  if (file === 'chart') return 'notes.chart'
  return file
}
