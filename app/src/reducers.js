import { combineReducers } from 'redux'
import { createForms } from 'react-redux-form'
import {
  REQUEST_USER,
  RECEIVE_USER,
  RECEIVE_USER_ERROR,
  RECEIVE_LOGOUT,
  RECEIVE_LOGIN_ERROR,
  RECEIVE_SIGN_UP_ERROR,
  REQUEST_PROJECTS,
  RECEIVE_PROJECTS,
} from './actions.js'

const signupError = (state=null, actions) => {
  switch (actions.type) {
    case RECEIVE_SIGN_UP_ERROR:
      return actions.error
    default:
      return state
  }
}

const loginError = (state=null, actions) => {
  switch (actions.type) {
    case RECEIVE_LOGIN_ERROR:
      return actions.error
    case RECEIVE_LOGOUT:
    case RECEIVE_USER:
      return null
    default:
      return state
  }
}

const user = (state={
  isFetching: false,
  error: {},
  data: {}
}, actions) => {
  switch (actions.type) {
    case REQUEST_USER:
      return { ...state, isFetching: true }
    case RECEIVE_USER:
      return { ...state, isFetching: false, error: {}, data: actions.data }
    case RECEIVE_USER_ERROR:
      return { ...state, isFetching: false, error: actions.error, data: {} }
    case RECEIVE_LOGOUT:
      return { ...state, isFetching: false, error: {}, data: {} }
    default:
      return state
  }
}

const projects = (state={
  isFetching: false,
  data: []
}, actions) => {
  switch (actions.type) {
    case REQUEST_PROJECTS:
      return { ...state, isFetching: true }
    case RECEIVE_PROJECTS:
      return { ...state, isFetching: false, data: actions.data }
    default:
      return state
  }
}

export default combineReducers({
  signupError,
  loginError,
  user,
  projects,
  ...createForms({
    projectForm: {},
    loginForm: {},
    signupForm: {}
  })
})
