import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import logo from './logo.png'

const Header = (props) => {
  return (
    <header style={styles.container}>
      <Link to="/"><img style={styles.img} src={logo} alt="lynk"/></Link>
      {props.isAuthenticated ? (
        <div style={styles.alignRight}>
          <span style={styles.email}>Welcome: {props.email}</span>
          <Button outline color="danger" size="sm">Logout</Button>
        </div>
      ) : (
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button outline color="success" style={styles.alignRight}>
            Sign Up
          </Button>
        </Link>
      )}
    </header>
  )
}

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
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  email: {
    color: '#777',
    padding: '0 10px'
  }
}

export default Header
