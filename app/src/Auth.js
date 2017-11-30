import React from 'react'
import { withRouter, Redirect } from 'react-router'
import { connect } from 'react-redux'
import { loginAsync, signupAsync } from './actions'

/* components */
import { Form, Control, actions } from 'react-redux-form'
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap'

class Login extends React.Component {
  render() {
    if (this.props.user.data.email) {
      return <Redirect to="/dashboard"/>
    }

    return (
      <div className="container" style={styles.container}>
        <h4>Welcome, Please Login</h4>
        {this.props.loginError && <Alert color="danger">{this.props.loginError}</Alert>}
        <AuthForm model="loginForm" submitText="Login" onSubmit={this.handleSubmit}></AuthForm>
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    // QUESTION: load initial status here or in reducer?
    this.props.dispatch(actions.load('loginForm', {
      email: '',
      password: ''
    }))
  }

  handleSubmit({ email, password }) {
    const { dispatch } = this.props
    dispatch(actions.submit('loginForm', dispatch(loginAsync(email, password))))
  }

}

class Signup extends React.Component {
  render() {
    if (this.props.user.data.email) {
      return <Redirect to="/dashboard"/>
    }
    const { signupError } = this.props
    return (
      <div className="container" style={styles.container}>
        <h4>Let's Sign Up</h4>
        {signupError && <Alert color="danger">{signupError}</Alert>}
        <AuthForm
          model="signupForm" submitText="Sign Up"
          onSubmit={this.handleSubmit}>
        </AuthForm>
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(credentials) {
    const { email, password } = credentials
    this.props.dispatch(signupAsync(email, password))
  }

  componentWillMount() {
    // QUESTION: load initial status here or in reducer?
    this.props.dispatch(actions.load('signupForm', {
      email: '',
      password: ''
    }))
  }
}

const AuthForm = ({ model, onSubmit, submitText='Submit' }) => (
  <Form model={model} style={styles.form} onSubmit={onSubmit}>
    <FormGroup>
      <Label htmlFor="email">Email</Label>
      <Control
        model=".email" component={Input}
        placeholder="Please input your emails address" >
      </Control>
    </FormGroup>
    <FormGroup>
      <Label htmlFor="password">Password</Label>
      <Control
        model=".password" type="password" component={Input}
        id="password" placeholder="Please input your password" >
      </Control>
    </FormGroup>
    <Button color="primary" outline block size="sm">{submitText}</Button>
  </Form>
)

const styles = {
  container: {
    marginTop: '50px',
    textAlign: 'center'
  },

  form: {
    textAlign: 'left',
    width: '300px',
    margin: '30px auto'
  }
}


const ConnectedLogin = connect((state) => ({
  loginError: state.loginError,
  user: state.user,
  loginForm: state.loginForm
}))(withRouter(Login))

const ConnectedSignup = connect((state) => ({
  signupError: state.signupError,
  user: state.user,
  signupForm: state.signupForm
}))(Signup)

export { ConnectedLogin as Login, ConnectedSignup as Signup }
