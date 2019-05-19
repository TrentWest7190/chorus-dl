import { configureStore } from 'redux-starter-kit'
import rootReducer from './reducers'
import { searchCharts } from './actions'

import downloads from './downloads'

const store = configureStore({
  reducer: { ...rootReducer, downloads: downloads.reducer },
})

store.dispatch(searchCharts())

export default store
