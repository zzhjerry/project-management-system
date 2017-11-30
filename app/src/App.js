import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserAsync } from './actions'

/* components */
import Header from './Header'
import { Login, Signup } from './Auth'
import Dashboard from './Dashboard'
import { ProjectDetail, ProjectNew } from './Project'
import Loading from './Loading'

class App extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <Loading/>
    }
    return (
      <Router>
        <div>
          <Header></Header>
          <Route exact path="/" component={Login}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route path="/new-project" component={ProjectNew}/>
          <Route path="/projects/:slug" component={ProjectDetail}/>
        </div>
      </Router>
    )
  }

  componentWillMount() {
    this.props.dispatch(getUserAsync())
  }
}

export default connect((state) => ({ isFetching: state.user.isFetching }))(App)
