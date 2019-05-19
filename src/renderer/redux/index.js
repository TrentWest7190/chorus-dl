import {configureStore} from 'redux-starter-kit'

import chorus from './slices/chorus'
import downloadManager from './slices/downloadManager'
import ui from './slices/ui'
import preferences from './slices/preferences'

const store = configureStore({
  reducer: {
    chorus: chorus.reducer,
    downloadManager: downloadManager.reducer,
    ui: ui.reducer,
    preferences: preferences.reducer
  }
})

export default store