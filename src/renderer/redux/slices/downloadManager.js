import { ipcRenderer } from 'electron'
import { createSlice } from 'redux-starter-kit'
import { toast } from 'react-toastify'

import ElectronStore from 'common/electronStore'

const downloadManager = createSlice({
  slice: 'downloadManager',
  initialState: {
    currentlyDownloading: [],
    dlCache: ElectronStore.get('dlCache', []),
  },
  reducers: {
    startDownload: (state, action) => {
      state.currentlyDownloading.push(action.payload)
    },
    downloadComplete: (state, action) => {
      state.currentlyDownloading = state.currentlyDownloading.filter(
        id => id !== action.payload.id,
      )
      state.dlCache.push(action.payload.hash)
    },
    clearCache: state => {
      state.dlCache = []
    },
    songScanned: (state, action) => {
      state.dlCache.push(action.payload)
    }
  },
})

export default downloadManager

export const downloadChart = chart => dispatch => {
  dispatch(downloadManager.actions.startDownload(chart.id))
  ipcRenderer.send('request-download', chart)
}

export const clearDlCache = () => dispatch => {
  ElectronStore.set('dlCache', [])
  dispatch(downloadManager.actions.clearCache())
  toast.success('Cache cleared!')
}