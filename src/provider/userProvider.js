import { api_get } from "@/libs/api_handler"
import { cookie_server_get, cookie_server_has, cookie_server_set } from "@/libs/cookie_server"
import { customToast } from "@/libs/customToast"
import { usePathname } from "next/navigation"
import { createContext, useEffect, useReducer } from "react"

const initialState = {
  data: null,
  status: '',
  error: '',
  token: ''
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS' :
      return { ...state, data: action.payload, status: 'fetched'}
    case 'FETCH_ERROR' :
      return { ...state, status: 'error', error: action.error }
    case 'FETCH_FAILED' :
      return { ...state, status: 'error', error: action.failed }
    case 'FETCH_LOADING':
      return { ...state, status: 'loading' }
    case 'NO_API_TOKEN':
      return { ...state, status: 'no_token', error: '', data: null }
    default:
      return state
  }
}

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const pathname = usePathname()
  
  const [state, dispatch] = useReducer(userReducer, initialState)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = cookie_server_get('api_token')
        dispatch({ type: 'FETCH_LOADING' })
        if(token) {
          const response = await api_get({
            url: '/api/auth/verify',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
  
          if(!response.success) {
            dispatch({ type: 'FETCH_SUCCESS', payload: null})
            
            customToast.failed({
              message: response?.message
            })
          }else{
            cookie_server_set('api_token', response?.data?.new_token)
            dispatch({ type: 'FETCH_SUCCESS', payload: {
              ...response?.data?.userdata,
              token: response?.data?.new_token
            }})
          }
        }else{
          dispatch({ type: 'NO_API_TOKEN' })
        }
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', error: response?.message })
      }
    }

    fetchUserData()
  }, [])

  return <UserContext.Provider value={{ user: state, user_dispatch: dispatch }}>
    {children}
  </UserContext.Provider>
}