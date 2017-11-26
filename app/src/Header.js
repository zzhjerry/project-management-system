import React from 'react'
import { Button } from 'reactstrap'
import logo from './logo.png'

const Header = (props) => {
  return (
    <header style={styles.header}>
      <img style={styles.img} src={logo} alt="lynk"/>
      {props.isAuthenticated ? (
        <div style={styles.alignRight}>
          <span style={styles.email}>Welcome: {props.email}</span>
          <Button outline color="danger" size="sm">Logout</Button>
        </div>
      ) : (
        <Button outlien color="success" size="sm" style={styles.alignRight}>
          Sign Up
        </Button>
      )}
    </header>
  )
}

const styles = {
  header: {
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
    display: 'flex',
    alignItems: 'center'
  },

  email: {
    padding: '0 10px'
  }
}

export default Header
