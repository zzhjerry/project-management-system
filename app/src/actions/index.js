import superagent from 'superagent'

export const RECEIVE_SIGN_UP_ERROR = 'RECEIVE_SIGN_UP_ERROR'
export const RECEIVE_LOGIN_ERROR = 'RECEIVE_LOGIN_ERROR'
export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS'
export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS'
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT'
export const REQUEST_PROJECT = 'REQUEST_PROJECT'
export const RECEIVE_PROJECT = 'RECEIVE_PROJECT'
export const RECEIVE_PROJECT_ERROR = 'RECEIVE_PROJECT_ERROR'

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

const requestProject = () => ({
  type: REQUEST_PROJECT
})

const receiveProject = (data) => ({
  type: RECEIVE_PROJECT,
  data
})

const receiveProjectError = (error) => ({
  type: RECEIVE_PROJECT_ERROR,
  error
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
    .withCredentials()
    .then(res => dispatch(receiveProjects(res.body)))

}

export const getProjectAsync = (slug) => (dispatch) => {
  dispatch(requestProject())
  return superagent.get(`/api/projects/${slug}`)
    .then(res => dispatch(receiveProject(res.body)))
    .catch(error => dispatch(receiveProjectError(error)))
}
