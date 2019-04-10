import { ipcMain, BrowserWindow } from 'electron'
import fs from 'fs-extra'
import find from 'find'
import crypto from 'crypto'
import Iconv from 'iconv-lite'

import Store from 'common/electronStore'

const getMD5 = txt => {
  const hash = crypto.createHash('md5')
  hash.update(txt)
  return hash.digest('hex')
}

const fileToChart = chart => {
  let returnVal = chart
  const utf8 = Iconv.decode(returnVal, 'utf8');
  if (utf8.indexOf('\u0000') >= 0) returnVal = Iconv.decode(chart, 'utf16');
  else if (utf8.indexOf('�') >= 0) returnVal = Iconv.decode(chart, 'latin1');
  else returnVal = utf8;
  return returnVal
}

ipcMain.on('scan-library', (ev, arg) => {

  const fileScanned = (hash) => {
    const dlCache = Store.get('dlCache', [])
    Store.set('dlCache', [...dlCache, hash])
    ev.sender.send('file-scanned', hash)
  }
  find.file(/\.chart/i,Store.get('library'), files => {
    files.forEach(file => {
      fs.readFile(file)
      .then((file) => {
        const chart = fileToChart(file)
        const hash = getMD5(chart)
        fileScanned(hash)
      })
    })
  })

  find.file(/\.mid/i,Store.get('library'), files => {
    files.forEach(file => {
      fs.readFile(file)
      .then((file) => {
        const hash = getMD5(file)
        fileScanned(hash)
      })
    })
  })
})