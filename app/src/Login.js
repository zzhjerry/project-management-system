import React from 'react'
import { withRouter, Redirect } from 'react-router'
import { connect } from 'react-redux'
import { loginAsync } from './actions'

/* components */
import { Form, Control, actions } from 'react-redux-form'
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap'

const AuthForm = ({ model, onSubmit, submitText='Submit' }) => (
  <Form model={model} style={styles.form} onSubmit={onSubmit}>
    <FormGroup>
      <Label for="email">Email</Label>
      <Control
        model=".email" component={Input}
        placeholder="Please input your emails address" >
      </Control>
    </FormGroup>
    <FormGroup>
      <Label for="password">Password</Label>
      <Control
        model=".password" type="password" component={Input}
        id="password" placeholder="Please input your password" >
      </Control>
    </FormGroup>
    <Button color="primary" outline block size="sm">{submitText}</Button>
  </Form>
)

class Login extends React.Component {
  render() {
    if (this.props.user.data.email) {
      return <Redirect to="/dashboard"/>
    }

    return (
      <div className="container" style={styles.container}>
        <h4>Welcome, Please Login</h4>
        {this.props.loginError ? (
          <Alert color="danger">{this.props.loginError}</Alert>
        ): (<p></p>)}
        <AuthForm
          model="loginForm" submitText="Login"
          onSubmit={this.handleSubmit}>
        </AuthForm>
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

const mapStateToProps = state => ({
  loginError: state.loginError,
  user: state.user,
  loginForm: state.loginForm
})

export default connect(mapStateToProps)(withRouter(Login))
