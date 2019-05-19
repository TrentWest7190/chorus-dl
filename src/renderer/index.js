import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import './index.css'
import './downloadManager'

import App from './App'
import store from './redux'

import {fetchCharts} from './redux/slices/chorus'

store.dispatch(fetchCharts())

ReactDOM.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,
  document.getElementById('app'),
)
