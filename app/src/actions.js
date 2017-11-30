import superagent from 'superagent'
import { actions } from 'react-redux-form'

export const RECEIVE_SIGN_UP_ERROR = 'RECEIVE_SIGN_UP_ERROR'
export const RECEIVE_LOGIN_ERROR = 'RECEIVE_LOGIN_ERROR'
export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'
export const RECEIVE_USER_ERROR = 'RECEIVE_USER_ERROR'
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

export const receiveUserError = (error) => ({
  type: RECEIVE_USER_ERROR,
  error
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
    .then(res => dispatch(receiveUser(res.body))).then(cb)
    .catch(error => dispatch(receiveUserError(error)))
}

export const signupAsync = (email, password) => (dispatch) => {
  dispatch(actions.resetValidity('signupForm'))
  dispatch(actions.setPending('signupForm', true))
  return superagent.post('/api/users')
    .send({ email, password })
    .then(res => dispatch(receiveUser(res.body)))
    .catch(error => {
      const { response: { body } } = error
      // the throwed value will be set to signupForm.errors
      throw body
    })
}

export const loginAsync = (email, password) => (dispatch) => {
  // reset the validation since some of them maybe stale after a second try
  dispatch(actions.resetValidity('loginForm'))
  dispatch(actions.setPending('loginForm', true))
  return superagent.post('/api/auth/login')
    .send({ email, password })
    .withCredentials()
    .then(res =>dispatch(receiveUser(res.body)))
    .catch(error => {
      // keys in the throwed error object will be set to error field of
      // corresponding keys of model specified in actions.submit
      // this will be catched by react-redux-form to set errors in
      // individual fields
      // Note that we mapped custom errors under the 'message' key
      const { response: { body } } = error
      throw body
    })
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
  return superagent.get(`/api/projects/${slug}`)
    .then(res => dispatch(actions.load('project', res.body)))
    .catch(error => dispatch(actions.setErrors('project', error)))
}
