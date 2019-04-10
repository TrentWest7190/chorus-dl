import {ipcRenderer} from 'electron'
import Store from './redux'

import { startDownload, updateDownloadProgress, downloadComplete } from './redux/actions'

ipcRenderer.on('download-started', (ev, id) => {
  Store.dispatch(startDownload(id))
})

ipcRenderer.on('download-progress', (ev, {id, progress}) => {
  Store.dispatch(updateDownloadProgress({id, progress}))
})

ipcRenderer.on('download-complete', (ev, id) => {
  Store.dispatch(downloadComplete(id))
})