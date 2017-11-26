import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserAsync } from './actions'

/* components */
import Header from './Header'
import Login from './Login'
import Signup from './Signup'
import Dashboard from './Dashboard'
import ProjectDetail from './ProjectDetail'

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(getUserAsync())
  }

  render() {
    return (
      <Router>
        <div>
          <Header></Header>
          <Route exact path="/" component={Login}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route path="/projects/:slug" component={ProjectDetail}/>
        </div>
      </Router>
    )
  }
}

export default connect()(App)
