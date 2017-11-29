import React from 'react'
import { connect } from 'react-redux'
import { logoutAsync } from './actions'

/* components */
import { NavLink, withRouter } from 'react-router-dom'
import { Button } from 'reactstrap'
import logo from './logo.png'

const Header = (props) => {
  const { history, dispatch } = props
  const redirect = () => history.push('/')
  const logout = () => dispatch(logoutAsync(redirect))

  return (
    <header style={styles.container}>
      <NavLink to="/"><img style={styles.img} src={logo} alt="lynk"/></NavLink>
      {props.email ? (
        <div style={styles.alignRight}>
          <span style={styles.email}>Welcome: {props.email}</span>
          <Button color="danger" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      ) : (
        <SignupOrLogin history={history}></SignupOrLogin>
      )}
    </header>
  )
}

// need to put withRouter outside of conenct for this component to
// rerender when location changes
const SignupOrLogin = withRouter(connect()(({ location }) => {
  const pathname = location.pathname
  if (pathname === '/') {
    return (
      <NavLink to="/signup" style={styles.alignRight}>
        <Button color="success">
          Sign Up
        </Button>
      </NavLink>
    )
  } else {
    return (
      <NavLink to="/" style={styles.alignRight}>
        <Button color="success">
          Login
        </Button>
      </NavLink>
    )
  }
}))

const styles = {
  container: {
    backgroundColor: '#f6fafa',
    padding: '20px 50px',
    display: 'flex',
    justifyContent: 'space-between'
  },

  img: {
    width: '50px',
    height: '50px'
  },

  alignRight: {
    textDecoration: 'none',
    margin: '10px 0',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  email: {
    color: '#777',
    padding: '0 10px'
  }
}

const mapStateToProps = state => ({
  email: state.user.data && state.user.data.email
})

export default withRouter(connect(mapStateToProps)(Header))
