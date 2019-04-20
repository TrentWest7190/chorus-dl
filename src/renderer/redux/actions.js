import { ipcRenderer } from 'electron'
import { createAction } from 'redux-starter-kit'
import { toast } from 'react-toastify'
import fetch from 'node-fetch'

import ElectronStore from 'common/electronStore'

export const requestCharts = createAction('requestCharts')
export const recieveCharts = createAction('recieveCharts')
export const requestDownload = createAction('requestDownload')
export const startDownload = createAction('startDownload')
export const updateDownloadProgress = createAction('updateDownloadProgress')
export const downloadComplete = createAction('downloadComplete')
export const openModal = createAction('openModal')
export const closeModal = createAction('closeModal')
export const openPreferences = createAction('openPreferences')
export const closePreferences = createAction('closePreferences')
export const updateLibrary = createAction('updateLibrary')
export const startSongScan = createAction('startSongScan')
export const songScanFinished = createAction('songScanFinished')
export const songScanned = createAction('songScanned')
export const clearCache = createAction('clearCache')
export const setSearchMode = createAction('setSearchMode')
export const setSaveFormat = createAction('setSaveFormat')
export const setInvalidSaveFormat = createAction('setInvalidSaveFormat')

export const fetchLatestCharts = () => {
  return dispatch => {
    dispatch(requestCharts())

    return fetch(`https://chorus.fightthe.pw/api/latest`)
      .then(
        response => response.json(),
        error => console.log('Error fetching latest charts: ', error),
      )
      .then(
        json => dispatch(recieveCharts(json)),
        error => console.log('Error fetching latest charts: ', error),
      )
  }
}

export const searchCharts = query => {
  return (dispatch, getState) => {
    dispatch(requestCharts())

    return fetch(`https://chorus.fightthe.pw/api/${getState().charts.mode}?query=${query}`)
      .then(
        response => response.json(),
        error => console.log('Error searching charts: ', error),
      )
      .then(
        json => dispatch(recieveCharts(json)),
        error => console.log('Error searching charts: ', error),
      )
  }
}

export const downloadChart = (chart) => {
  return dispatch => {
    dispatch(requestDownload(chart.id))
    ipcRenderer.send('request-download', chart)
  }
}

export const saveLibraryPath = newPath => {
  return dispatch => {
    dispatch(updateLibrary(newPath))
    ElectronStore.set('library', newPath)
  }
}

export const saveSaveFormat = newFormat => {
  return dispatch => {
    dispatch(setInvalidSaveFormat(false))
    dispatch(setSaveFormat(newFormat))
    ElectronStore.set('saveFormat', newFormat)
  }
}

export const clearSongCache = () => {
  return dispatch => {
    ElectronStore.set('dlCache', [])
    dispatch(clearCache())
    toast.success('Cache cleared!')
  }
}
