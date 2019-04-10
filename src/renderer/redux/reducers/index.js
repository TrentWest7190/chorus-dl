import { createReducer } from 'redux-starter-kit'
import {
  requestCharts,
  recieveCharts,
  requestDownload,
  startDownload,
  updateDownloadProgress,
  downloadComplete,
  openModal,
  closeModal,
  updateLibrary,
  songScanned,
  clearCache,
  openPreferences,
  closePreferences
} from '../actions'

import ElectronStore from 'common/electronStore'

const initialState = {
  downloads: {
    byId: {},
    currentlyDownloading: [],
    wasDownloaded: []
  },
  charts: {
    isFetching: false,
    items: [],
  },
  ui: {
    modal: '',
    modalOpen: false,
    preferencesOpen: false
  },
  preferences: {
    library: ElectronStore.get('library', '')
  },
  dlCache: ElectronStore.get('dlCache', [])
}

export default createReducer(initialState, {
  [requestCharts]: state => {
    state.charts.isFetching = true
  },
  [recieveCharts]: (state, action) => {
    state.charts.isFetching = false
    state.charts.items = action.payload.songs
  },
  [requestDownload]: (state, action) => {
    state.downloads.currentlyDownloading.push(action.payload)
    state.downloads.wasDownloaded = state.downloads.wasDownloaded.filter(
      dl => dl !== action.payload
    )
  },
  [startDownload]: (state, action) => {
    state.downloads.byId[action.payload] = {
      progress: 0,
    }
  },
  [updateDownloadProgress]: (state, action) => {
    state.downloads.byId[action.payload.id].progress = action.payload.progress
  },
  [downloadComplete]: (state, action) => {
    state.downloads.currentlyDownloading = state.downloads.currentlyDownloading.filter(
      dl => dl !== action.payload.id,
    )
    state.dlCache.push(action.payload.hash)
    state.downloads.wasDownloaded.push(action.payload.id)
  },
  [openModal]: (state, action) => {
    state.ui.modalOpen = true
    state.ui.modal = action.payload
  },
  [closeModal]: (state) => {
    state.ui.modal = ''
    state.ui.modalOpen = false
  },
  [openPreferences]: (state) => {
    state.ui.preferencesOpen = true
  },
  [closePreferences]: (state) => {
    state.ui.preferencesOpen = false
  },
  [updateLibrary]: (state, action) => {
    state.preferences.library = action.payload
  },
  [songScanned]: (state, action) => {
    state.dlCache.push(action.payload)
  },
  [clearCache]: (state) => {
    state.dlCache = []
  }
})
