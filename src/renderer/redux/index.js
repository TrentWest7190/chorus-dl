import { configureStore } from 'redux-starter-kit'
import rootReducer from './reducers'
import { fetchLatestCharts } from './actions'

const store = configureStore({
  reducer: rootReducer
})

store.dispatch(fetchLatestCharts())

export default store