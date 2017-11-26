import React from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

const Login = () => {
  return (
    <div style={styles.container}>
      <h4>Welcome, Please Login</h4>
      <Form style={styles.form}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="Please input your emails address" />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input minLength="8" type="password" name="password" id="password" placeholder="Please input your password" />
        </FormGroup>
        <Button color="primary" outline block size="sm">Login</Button>
      </Form>
    </div>
  )
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
export default Login
