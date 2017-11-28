import React from 'react'
import superagent from 'superagent'
import { connect } from 'react-redux'
import { getProjectAsync } from './actions'
import md from 'markdown-it'

/* components */
import { actions, Form, Control } from 'react-redux-form'
import { Button, Badge, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

class ProjectDetail extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <h1>Loading</h1>
    }

    const { title, status, createdAt, description, slug } = this.props.project
    return (
      <div className="w-75 m-auto p-5">
        <ConnectedProjectHeader title={title} slug={slug}></ConnectedProjectHeader>
        <ProjectStatus status={status} createdAt={createdAt}></ProjectStatus>
        <Description description={description} slug={slug}></Description>
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
        <Form model="project.title" className="d-flex" onSubmit={this.handleSubmit}>
          <Control.text model="project.title" className="mr-auto w-50" placeholder="Title"></Control.text>
          <Button type="submit" className="mx-sm-1" color="success">Save</Button>
          <Button onClick={this.handleCancel} color="danger">Cancel</Button>
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
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  toggleEditable() {
    console.log('called')
    this.setState({ editable: !this.state.editable })
  }

  handleCancel() {
    // I want to reset form and toggle the editable state but failed, see
    // https://github.com/davidkpiano/react-redux-form/issues/1029
    // TODO: try not using reload
    window.location.reload()
  }

  handleSubmit(title) {
    const { slug, dispatch } = this.props
    const toggleEditable = this.toggleEditable
    dispatch(actions.setPending('project.title', true))
    const update$Q = superagent.put(`/api/projects/${slug}`)
          .send({ title })
          .then(res => {
            toggleEditable()
            dispatch(actions.setSubmited('project.title', true))
          })
          .catch(err => err)
    dispatch(actions.submit('project.title', update$Q))
  }
}

const ConnectedProjectHeader = connect()(ProjectHeader)

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
    const { description, slug } = this.props
    if (this.state.editable) {
      return (
        <ConnectedDescriptionEditAndPreview
          slug={slug}
          text={description}
          toggleEditable={this.toggleEditable}>
        </ConnectedDescriptionEditAndPreview>
      )
    }
    return (
      <DescriptionDisplay
        text={description}
        onEditButtonClick={this.toggleEditable}>
      </DescriptionDisplay>
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

const ExpertList = () => (
  <p>experts</p>
)

class DescriptionEditAndPreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: '1'
    }

    this.toggle = this.toggle.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  handleSubmit(description) {
    const { slug, dispatch } = this.props
    const toggleEditable = this.props.toggleEditable
    dispatch(actions.setPending('project.description', true))
    const update$Q = superagent.put(`/api/projects/${slug}`)
          .send({ description })
          .then(res => {
            toggleEditable()
            dispatch(actions.setSubmited('project.description', true))
          })
          .catch(err => err)
    dispatch(actions.submit('project.description', update$Q))

  }

  handleCancel() {
    window.location.reload()
  }

  render() {
    return (
      <Form model="project.description" className="w-75" onSubmit={(description) => this.handleSubmit(description)}>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={this.state.activeTab==='1' ? 'active' : ''}
              onClick={() => this.toggle('1')}>
              Write
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={this.state.activeTab==='2' ? 'active' : ''}
              onClick={() => this.toggle('2')}>
              Preview
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab} className="border border-top-0 border-left-0 border-right-0">
          <TabPane tabId="1">
            <Control.textarea className="w-100 border-0 bg-light p-2" rows={10} model="project.description"></Control.textarea>
          </TabPane>
          <TabPane tabId="2" className="p-2">
            <MarkdownDisplay text={this.props.text}></MarkdownDisplay>
          </TabPane>
        </TabContent>
        <div className="d-flex flex-row-reverse my-2">
          <Button type="submit" size="sm" color="success">Submit</Button>
          <Button className="mx-2" size="sm" color="danger" onClick={this.handleCancel}>Cancel</Button>
        </div>
      </Form>
    )
  }
}

const ConnectedDescriptionEditAndPreview = connect()(DescriptionEditAndPreview)

const DescriptionDisplay = (props) => {
  const { onEditButtonClick } = props
  return (
    <div className="my-4 p-3 border border-left-0 border-right-0 w-75">
      <MarkdownDisplay text={props.text}/>
      <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '12px' }}>
        <span className="font-italic">Markdown is supported</span>
        <Button className="h-50" color="none" size="sm" onClick={onEditButtonClick}>
          <i className="fa fa-pencil mr-1"></i>
          Edit
        </Button>
      </div>
    </div>
  )
}

const MarkdownDisplay = (props) => {
  const { text = '' } = props
  const html = md().render(text)
  return (
    <div dangerouslySetInnerHTML={{__html:html}} />
  )
}

const mapStateToProps = state => {
  return {
    project: state.project,
  }
}

export default connect(mapStateToProps)(ProjectDetail)
