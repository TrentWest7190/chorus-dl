import {createSlice} from 'redux-starter-kit'

const ui = createSlice({
  slice: 'ui',
  initialState: {
    preferencesOpen: false,
    scanningSongs: false
  },
  reducers: {
    openPreferences: state => {
      state.preferencesOpen = true
    },
    closePreferences: state => {
      state.preferencesOpen = false
    },
    startSongScan: state => {
      state.scanningSongs = true
    },
    songScanFinished: state => {
      state.scanningSongs = false
    }
  }
})

export default ui