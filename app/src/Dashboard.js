import React from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { getProjectsAsync } from './actions'

/* componnets */
import { Button, Collapse } from 'reactstrap'
import Loading from './Loading'

class Dashboard extends React.Component {
  render() {
    if (this.props.isFetching || this.props.user.isFetching) {
      return <Loading/>
    }
    const { projects } = this.props
    const newProjects = projects.filter(project => project.status === 'new')
    const pendingProjects = projects.filter(project => project.status === 'pending')
    const unfinishedProjects = projects.filter(project => {
      const threeDaysInMilliseconds = 1000 * 60 * 60 * 24 * 3
      const threeDaysAgo = new Date(new Date().getTime() - threeDaysInMilliseconds)
      const projectCreatitionDate = new Date(project.createdAt)
      return project.status === 'pending' && projectCreatitionDate < threeDaysAgo
    })

    if (!this.props.user.data.email) {
      return <Redirect to="/"/>
    }

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3>Projects</h3>
          <NavLink to="/new-project">
            <Button color="success">New</Button>
          </NavLink>
        </div>
        <ProjectList status="New" projects={newProjects}></ProjectList>
        <ProjectList status="Pending" projects={pendingProjects}></ProjectList>
        <ProjectList status="Expired" projects={unfinishedProjects}></ProjectList>
      </div>
    )
  }

  componentWillMount() {
    this.props.dispatch(getProjectsAsync())
  }
}

const ProjectList = (props) => {
  const projects = props.projects.map(project => (
    <li className="list-group-item" key={project._id}><Project project={project}/></li>
  ))
  return (
    <div className="mt-3">
      <p className="lead">{props.status}</p>
      <ul className="list-group">{projects}</ul>
    </div>
  )
}

class Project extends React.Component {
  render() {
    const approvedExperts = this.props.project.experts.filter((record, index) => (
      record.status === 'approved'
    ))
    return (
      <div>
        <div className="d-flex align-items-center">
          <NavLink to={`/projects/${this.props.project.slug}`} className='mr-auto'>
            {this.props.project.title}
          </NavLink>
          <Button onClick={this.toggle} size="sm" color="info">{approvedExperts.length} Experts Approved</Button>
        </div>
        <Collapse isOpen={this.state.collapse}>
          <ul className="list-unstyled">
            {approvedExperts.map((record, index) => {
              const { expert: { firstname, lastname } } = record
              return <li key={record._id} className="text-secondary">{firstname} {lastname}</li>
            })}
          </ul>
        </Collapse>
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { collapse: false }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse })
  }
}

const styles = {
  container: {
    margin: '0 auto',
    width: '1000px'
  },

  header: {
    margin: '20px',
    marginLeft: '0',
    display: 'flex',
    justifyContent: 'space-between'
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isFetching: state.projects.isFetching,
  projects: state.projects.data
})

export default connect(mapStateToProps)(Dashboard)
