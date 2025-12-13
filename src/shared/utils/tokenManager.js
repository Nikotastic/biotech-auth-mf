import Cookies from 'js-cookie'

export const tokenManager = {
  setToken: (token) => {
    Cookies.set('auth_token', token, { expires: 7 })
  },
  
  getToken: () => {
    return Cookies.get('auth_token')
  },
  
  removeToken: () => {
    Cookies.remove('auth_token')
  }
}