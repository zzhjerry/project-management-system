import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Header from './Header'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import ProjectDetail from './ProjectDetail'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header isAuthenticated={false} email={'zzh699@gmail.com'}></Header>
          <Route exact path="/" component={Login}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route path="/projects/:slug" component={ProjectDetail}/>
        </div>
      </Router>
    )
  }
}

export default App
