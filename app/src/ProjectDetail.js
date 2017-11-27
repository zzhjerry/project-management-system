import React from 'react'
import { connect } from 'react-redux'
import { getProjectAsync } from './actions'

/* components */
import { Form, Button, Input, Badge } from 'reactstrap'

class ProjectDetail extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <h1>Loading</h1>
    }

    const { title, status } = this.props.project
    return (
      <div className="w-75 m-auto p-5">
        <ProjectHeader title={title}></ProjectHeader>
        <ProjectStatus status={status}></ProjectStatus>
        <Description></Description>
        <ExpertList></ExpertList>
      </div>
    )
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(getProjectAsync(match.params.slug))
  }
}

class ProjectHeader extends React.Component {
  render() {
    if (this.state.editable) {
      return (
        <Form inline class="d-flex">
          <Input value={this.props.title} className="mr-auto w-50" placeholder="Title"></Input>
          <Button className="m-xl-1" color="success">Save</Button>
          <Button color="danger">Cancel</Button>
        </Form>
      )
    }
    return (
      <header className="d-flex align-items-center">
        <h1 className="mr-auto">{this.props.title}</h1>
        <Button className="h-100" color="primary" onClick={this.toggleEditable}>Edit</Button>
      </header>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      editable: false
    }
    this.toggleEditable = this.toggleEditable.bind(this)
  }

  toggleEditable() {
    this.setState({ editable: !this.state.editable })
  }
}

const ProjectStatus = (props) => {
  const color = (status) => {
    switch (status) {
      case 'new':
        return 'success'
      case 'pending':
        return 'warning'
      default:
        return 'danger'
    }
  }
  return (
    <div className="mb-2">
      <Badge disabled color={color(props.status)}>
        {props.status}
      </Badge>
    </div>
  )
}

const Description = ({ editable }) => (
  <p>description</p>
)

const ExpertList = () => (
  <p>experts</p>
)

const mapStateToProps = state => {
  return {
    isFetching: state.currentProject.isFetching,
    project: state.currentProject.data,
    error: state.error
  }
}

export default connect(mapStateToProps)(ProjectDetail)
