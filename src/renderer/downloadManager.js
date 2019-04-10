import {ipcRenderer} from 'electron'
import Store from './redux'

import { startDownload, updateDownloadProgress, downloadComplete, songScanned, songScanFinished } from './redux/actions'

ipcRenderer.on('download-started', (ev, id) => {
  Store.dispatch(startDownload(id))
})

ipcRenderer.on('download-progress', (ev, {id, progress}) => {
  Store.dispatch(updateDownloadProgress({id, progress}))
})

ipcRenderer.on('download-complete', (ev, {id, hash}) => {
  Store.dispatch(downloadComplete({id, hash}))
})

ipcRenderer.on('file-scanned', (ev, hash) => {
  Store.dispatch(songScanned(hash))
})

let scanProgress = 0
ipcRenderer.on('scan-partial', () => {
  scanProgress++
  if (scanProgress === 2) {
    scanProgress = 0
    Store.dispatch(songScanFinished())
  }
})

ipcRenderer.on('scan-complete', (ev) => {
  Store.dispatch(songScanFinished())
})