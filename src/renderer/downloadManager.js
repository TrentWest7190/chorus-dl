import {ipcRenderer} from 'electron'
import Store from './redux'

import downloadManager from './redux/slices/downloadManager'

import ui from './redux/slices/ui'

ipcRenderer.on('download-complete', (ev, {id, hash}) => {
  Store.dispatch(downloadManager.actions.downloadComplete({id, hash}))
})

ipcRenderer.on('file-scanned', (ev, hash) => {
  Store.dispatch(downloadManager.actions.songScanned(hash))
})

let scanProgress = 0
ipcRenderer.on('scan-partial', () => {
  scanProgress++
  if (scanProgress === 2) {
    scanProgress = 0
    Store.dispatch(ui.actions.songScanFinished())
  }
})