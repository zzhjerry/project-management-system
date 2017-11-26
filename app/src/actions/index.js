import superagent from 'superagent'

export const RECEIVE_SIGN_UP_ERROR = 'RECEIVE_SIGN_UP_ERROR'
export const RECEIVE_LOGIN_ERROR = 'RECEIVE_LOGIN_ERROR'
export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'

export const receiveSignupError = (error) => ({
  type: RECEIVE_SIGN_UP_ERROR,
  error
})

export const receiveLoginError = (error) => ({
  type: RECEIVE_LOGIN_ERROR,
  error
})

export const requestUser = () => ({
  type: REQUEST_USER
})

export const receiveUser = (data) => ({
  type: RECEIVE_USER,
  data
})

// TODO: use real api call
export const getUserAsync = () => (dispatch) => {
  setTimeout(
    dispatch(receiveUser({
      email: 'zzh699@gmail.com'
    }), 200)
  )
}

export const signupAsync = (email, password, cb) => (dispatch) => {
  return superagent.post('/api/users').send({ email, password })
    .then(cb)
    .catch(error => dispatch(receiveSignupError(error)))
}

export const loginAsync = (email, password, cb) => (dispatch) => {
  return superagent.post('/api/auth/login').send({ email, password })
    .then(cb)
    .catch(error => dispatch(receiveLoginError(error)))
}

export const logoutAsync = (cb) => (dispatch) => {
  return superagent.get('/api/auth/logout').then(cb)
}
