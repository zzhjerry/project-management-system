import React from 'react'
import { connect } from 'react-redux'
import { getProjectAsync } from './actions'
import md from 'markdown-it'

/* components */
import { Form, Button, Input, Badge } from 'reactstrap'

class ProjectDetail extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <h1>Loading</h1>
    }

    const { title, status, createdAt, description } = this.props.project
    return (
      <div className="w-75 m-auto p-5">
        <ProjectHeader title={title}></ProjectHeader>
        <ProjectStatus status={status} createdAt={createdAt}></ProjectStatus>
        <Description description={description}></Description>
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
    <div className="mb-2 d-flex align-items-center">
      <Badge disabled color={color(props.status)}>
        {props.status}
      </Badge>
      <small className="ml-2">Created at: {props.createdAt}</small>
    </div>
  )
}

class Description extends React.Component {
  render() {
    const { editable, description, authenticated } = this.props
    if (authenticated && editable) {
      return (
        <MarkdownEditAndPreview
          text={description}
          onSaveButtonClick={this.handleSave}
          onCancelButtonClick={this.handleCancel} >
        </MarkdownEditAndPreview>
      )
    }
    return (
      <MarkdownDisplay
        text={description}
        onEditButtonClick={this.toggleEditable}>
      </MarkdownDisplay>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      editable: false
    }
    this.toggleEditable = this.toggleEditable.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  toggleEditable() {
    this.setState({ editable: !this.state.editable })
  }

  handleSave() {}
  handleCancel() {}
}

const ExpertList = () => (
  <p>experts</p>
)

const MarkdownEditAndPreview = (props) => {
  return (
    <p>Preview</p>
  )
}

const MarkdownDisplay = (props) => {
  const { text = '' } = props
  const html = md().render(text)
  const { onEditButtonClick } = props
  return (
    <div className="my-4 p-3 border border-left-0 border-right-0 w-75">
      <div dangerouslySetInnerHTML={{__html:html}} />
      <div className="d-flex justify-content-between" style={{ fontSize: '12px' }}>
        <span className="font-italic">Markdown is supported</span>
        <a onClick={onEditButtonClick}>
          <i className="fa fa-pencil mr-1"></i>
          Edit
        </a>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isFetching: state.currentProject.isFetching,
    project: state.currentProject.data,
    error: state.error
  }
}

export default connect(mapStateToProps)(ProjectDetail)
