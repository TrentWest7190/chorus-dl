import { configureStore } from 'redux-starter-kit'
import rootReducer from './reducers'
import { searchCharts } from './actions'

const store = configureStore({
  reducer: rootReducer
})

store.dispatch(searchCharts())

export default store