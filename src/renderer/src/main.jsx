import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './assets/scss/main.scss'
import { Provider } from 'react-redux'
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import store from './redux/store'
import 'react-datepicker/dist/react-datepicker.css'
import 'icofont/dist/icofont.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
)
