import React from 'react'
import ReactDOM from 'react-dom'
import './style/index.scss'
import App from './corona-app/corona-app'
import * as serviceWorker from './services/service-worker'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

serviceWorker.unregister()
