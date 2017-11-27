import superagent from 'superagent'

export const RECEIVE_SIGN_UP_ERROR = 'RECEIVE_SIGN_UP_ERROR'
export const RECEIVE_LOGIN_ERROR = 'RECEIVE_LOGIN_ERROR'
export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS'
export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS'
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT'

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

export const requestProjects = () => ({
  type: REQUEST_PROJECTS
})

export const receiveProjects = (data) => ({
  type: RECEIVE_PROJECTS,
  data
})

const receiveLogout = () => ({
  type: RECEIVE_LOGOUT
})

export const getUserAsync = (cb) => (dispatch) => {
  return superagent.get('/api/users/current')
    .withCredentials()
    .then(res => dispatch(receiveUser(res.body)))
    .catch(cb)
}

export const signupAsync = (email, password, cb) => (dispatch) => {
  return superagent.post('/api/users').send({ email, password })
    .then(res => dispatch(receiveUser(res.body))).then(cb)
    .catch(error => dispatch(receiveSignupError(error)))
}

export const loginAsync = (email, password, cb) => (dispatch) => {
  return superagent.post('/api/auth/login').send({ email, password })
    .then(res => dispatch(receiveUser(res.body))).then(cb)
    .catch(error => dispatch(receiveLoginError(error)))
}

export const logoutAsync = (cb) => (dispatch) => {
  return superagent.get('/api/auth/logout').then(() => {
    return dispatch(receiveLogout())
  }).then(cb)
}

export const getProjectsAsync = () => (dispatch) => {
  dispatch(requestProjects())
  return superagent.get('/api/projects')
    .then(res => dispatch(receiveProjects(res.body)))

}
