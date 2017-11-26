import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { signupAsync } from './actions'

/* components */
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

class Signup extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <h4>Let's Sign Up</h4>
        <Form style={styles.form} onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" value={this.state.email}
                   onChange={this.handleInputChange}
                   placeholder="Please input your emails address" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input minLength="8" type="password" name="password" value={this.state.password}
                   onChange={this.handleInputChange}
                   id="password" placeholder="Please input your password" />
          </FormGroup>
          <Button color="primary" outline block size="sm">Sign Up</Button>
        </Form>
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target

    this.setState({
      [target.name]: target.value
    })
  }

  handleSubmit(event) {
    const [ email, password ] = [ this.state.email, this.state.password ]
    const { history } = this.props
    const onSuccess = () => history.push('/dashboard')
    this.props.dispatch(signupAsync(email, password, onSuccess))
    event.preventDefault()
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

export default connect()(withRouter(Signup))
