import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// import Sidebar from './components/common/Sidebar'
import Sidebar from './components/common/Sidebar'
import AuthIndex from './screens/Routes/AuthIndex'
import MainIndex from './screens/Routes/MainIndex'
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials, deleteCredentials } from './redux/features/credentialSlice'
import { constants } from './constants/constants'
import Loading from './components/UI/Loading'
import { jwtDecode } from 'jwt-decode'
import { setBASE_URL } from './constants/api-url'
import queryString from 'query-string'

function App(props) {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const Cred = useSelector((state) => state.Cred)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(false)

  async function getCred() {
    setLoading(true)
    try {
      const token = await window.localStorage.getItem(constants.token_store)
      if (token) {
        const decode = await jwtDecode(token)
        dispatch(setCredentials({ ...decode, token }))
      } else {
        navigate('/')
        dispatch(deleteCredentials())
      }
    } catch (error) {
      console.log('Error:', error)
      navigate('/')
      dispatch(deleteCredentials())
    }
    setLoading(false)
  }

  // bhavishya's function implemented in order for mobile to work
  const isLoginFromApp = async (parsedData) => {
    try {
      if (parsedData.token) {
        let token = parsedData.token
        let clientType = parsedData.clientType
        // let redirectPoint = parsedData.redirectToEndPoint
        let tenantDomain = parsedData.tenantDomain
        window.localStorage.setItem(constants.token_store, token)
        window.localStorage.setItem(constants.base_url, tenantDomain)
        window.localStorage.setItem(constants.clientType, clientType)
        window.localStorage.setItem('isMember', true)
        const decode = jwtDecode(token)
        dispatch(setCredentials({ token, ...decode, isMember: true }))
      } else {
        navigate('/')
      }
    } catch (error) {
      console.log('Error in login process:', error)
    }
  }

  useEffect(() => {
    const parsed = queryString.parse(location.search)
    if (parsed.isApp == 'true') {
      isLoginFromApp(parsed)
    }
  }, [])

  useEffect(() => {
    setBASE_URL()
    getCred()
  }, [])

  const activekey = () => {
    let res = window.location.pathname
    let baseUrl = process.env.PUBLIC_URL
    baseUrl = baseUrl.split('/')
    res = res.split('/')
    res = res.length > 0 ? res[baseUrl.length] : '/'
    return res ? '/' + res : '/'
  }

  if (loading) {
    return <Loading animation={'border'} color={'yellow'} />
  }

  return (
    <>
      {Cred.token ? (
        <div id="mytask-layout" className="theme-indigo">
          <Sidebar activekey={activekey()} history={props.history} />
          <MainIndex activekey={activekey} />
        </div>
      ) : (
        <div id="mytask-layout" className="theme-indigo">
          <AuthIndex />
        </div>
      )}
    </>
  )
}

export default App
