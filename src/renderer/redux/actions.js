import { ipcRenderer } from 'electron'
import { createAction } from 'redux-starter-kit'
import fetch from 'node-fetch'

import ElectronStore from '../electronStore'

export const requestCharts = createAction('requestCharts')
export const recieveCharts = createAction('recieveCharts')
export const requestDownload = createAction('requestDownload')
export const startDownload = createAction('startDownload')
export const updateDownloadProgress = createAction('updateDownloadProgress')
export const downloadComplete = createAction('downloadComplete')
export const openModal = createAction('openModal')
export const closeModal = createAction('closeModal')
export const updateLibrary = createAction('updateLibrary')

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

export const searchCharts = (query) => {
  return dispatch => {
    dispatch(requestCharts())

    return fetch(`https://chorus.fightthe.pw/api/search?query=${query}`)
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

export const downloadChart = ({directLinks, id, artist, name}) => {
  return dispatch => {
    dispatch(requestDownload(id))
    ipcRenderer.send('request-download', {
      directLinks,
      id,
      artist,
      name
    })
  }
}

export const saveLibraryPath = (newPath) => {
  return dispatch => {
    dispatch(updateLibrary(newPath))
    ElectronStore.set('library', newPath)
  }
}