import { createSlice } from 'redux-starter-kit'

import ElectronStore from 'common/electronStore'

const preferences = createSlice({
  slice: 'preferences',
  initialState: {
    library: ElectronStore.get('library', ''),
    saveFormat: ElectronStore.get('saveFormat', ':artist - :name'),
    invalidSaveFormat: false,
  },
  reducers: {
    updateLibrary: (state, action) => {
      state.library = action.payload
    },
    updateSaveFormat: (state, action) => {
      state.saveFormat = action.payload
    },
    setInvalidSaveFormat: (state, action) => {
      state.invalidSaveFormat = action.payload
    },
  },
})

export default preferences

export const saveLibraryPath = newPath => dispatch => {
  dispatch(preferences.actions.updateLibrary(newPath))
  ElectronStore.set('library', newPath)
}

export const saveSaveFormat = newFormat => dispatch => {
  dispatch(preferences.actions.setInvalidSaveFormat(false))
  dispatch(preferences.actions.updateSaveFormat(newFormat))
  ElectronStore.set('saveFormat', newFormat)
}