import React from 'react'
import superagent from 'superagent'
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { getProjectAsync } from './actions'
import md from 'markdown-it'

/* components */
import { track, actions, Form, Control, Errors } from 'react-redux-form'
import {
  Button, Badge, Nav, NavItem, NavLink,
  TabContent, TabPane, ListGroup, ListGroupItem,
  Input
} from 'reactstrap'
import Loading from './Loading'

class ProjectDetail extends React.Component {
  render() {
    if (this.props.isFetching) {
      return <Loading/>
    }

    const { title, status, createdAt, description, slug, experts } = this.props.projectForm
    return (
      <div className="w-75 m-auto p-5">
        <ConnectedProjectHeader title={title} slug={slug}></ConnectedProjectHeader>
        <ProjectStatus status={status} createdAt={createdAt}></ProjectStatus>
        <Description description={description} slug={slug}></Description>
        <ExpertList experts={experts} slug={slug}></ExpertList>
      </div>
    )
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(getProjectAsync(match.params.slug))
  }
}

class ProjectNew extends React.Component {
  render() {
    if (!this.props.user.data.email) {
      return <Redirect to="/"/>
    }

    return (
      <div className="w-75 m-auto p-5">
        <Form className="w-75" model="projectForm" onSubmit={this.handleSubmit}>
          <Errors model=".message" className="text-danger"/>
          <Control.text model=".title" component={Input} className="my-3 w-50" placeholder="Title"></Control.text>
          <Errors model=".title" className="text-danger"/>
          <MarkdownEditAndPreview
            model=".description"
            text={this.props.projectForm.description}>
          </MarkdownEditAndPreview>
          <Button type="submit" className="my-3" color="success">Save</Button>
        </Form>
      </div>
    )
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(actions.load('projectForm', {
      title: '',
      description: ''
    }))
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(project) {
    const { dispatch, history } = this.props
    dispatch(actions.resetValidity('projectForm'))
    const update$Q = superagent.post(`/api/projects`)
          .send({ ...project })
          .then(res => {
            history.push('/dashboard')
          })
          .catch(err => {
            throw err.response.body
          })
    dispatch(actions.submitFields('projectForm', update$Q))
  }
}

class ProjectHeader extends React.Component {
  render() {
    if (this.state.editable) {
      return (
        <div>
          <Errors model="projectForm.message" class="text-danger"/>
          <Form model="projectForm.title" className="d-flex" onSubmit={this.handleSubmit}>
            <Control.text component={Input} model="projectForm.title" className="mr-auto w-50"
                          placeholder="Title">
            </Control.text>
            <Button type="submit" className="mx-sm-1" color="success">Save</Button>
            <Button onClick={this.handleCancel} color="danger">Cancel</Button>
          </Form>
        </div>
      )
    }

    return (
      <header className="d-flex align-items-center">
        <h1 className="mr-auto">{this.props.title}</h1>
        {this.props.user.data.email && <Button className="h-100" color="primary" onClick={this.toggleEditable}>Edit</Button>}
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
    dispatch(actions.setPending('projectForm.title', true))
    const update$Q = superagent.put(`/api/projects/${slug}`)
          .send({ title })
          .then(res => {
            toggleEditable()
            dispatch(actions.setSubmited('projectForm.title', true))
          })
          .catch(err => {
            throw err.response.body
          })
    dispatch(actions.submitFields('projectForm', update$Q))
  }
}

const ConnectedProjectHeader = connect((state) => ({ user: state.user }))(ProjectHeader)

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
  const date = new Date(props.createdAt)
  return (
    <div className="my-2 d-flex align-items-center">
      <Badge disabled color={color(props.status)}>
        {props.status}
      </Badge>
      <small className="ml-2">Created at: {date.toLocaleString()}</small>
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
      <ConnectedDescriptionDisplay
        text={description}
        onEditButtonClick={this.toggleEditable}>
      </ConnectedDescriptionDisplay>
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

const ExpertList = (props) => {
  if (!props.experts) return (<p></p>)

  const experts = props.experts.map(expert => (
    <ListGroupItem key={expert.expert._id}>
      <ConnectedExpert expert={expert} slug={props.slug}></ConnectedExpert>
    </ListGroupItem>
  ))

  return (
    <div className="mt-3 w-75">
      <p className="lead">Experts</p>
      <ListGroup>{experts}</ListGroup>
    </div>
  )
}

class Expert extends React.Component {
  // props.expert contains expert detail and status
  render() {
    const { expert={}, status='' } = this.props.expert
    const approved = status === 'approved'
    const button = (
      <Button onClick={this.changeStatus} color={approved ? 'danger' : 'success' } size="sm">
        {approved ? 'Reject' : 'Approve' }
      </Button>
    )
    return (
      <div className="d-flex align-items-center">
        <div>{`${expert.firstname} ${expert.lastname}`}</div>
        <Badge color={approved ? 'success' : 'danger'} className="ml-2 mr-auto">{status}</Badge>
        {this.props.user.data.email && button}
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.changeStatus = this.changeStatus.bind(this)
  }

  changeStatus() {
    const { dispatch, slug } = this.props
    const { expert, status } = this.props.expert
    const approved = status === 'approved'
    const newStatus = approved ? 'rejected' : 'approved'
    const body = {
      _id: expert._id,
      status: newStatus
    }
    const update$Q = superagent.put(`/api/projects/${slug}`)
          .send({ expert: body })
          .then(res => res)
          .catch(err => err)
    dispatch(actions.change(track(
      'projectForm.experts[].status', { 'expert._id': expert._id }), newStatus))
    dispatch(actions.submit('projectForm', update$Q))

  }
}

const ConnectedExpert = connect((state) => ({ user: state.user }))(Expert)

class DescriptionEditAndPreview extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit(description) {
    const { slug, dispatch } = this.props
    const toggleEditable = this.props.toggleEditable
    dispatch(actions.setPending('projectForm.description', true))
    const update$Q = superagent.put(`/api/projects/${slug}`)
          .send({ description })
          .then(res => {
            toggleEditable()
            dispatch(actions.setSubmited('projectForm.description', true))
          })
          .catch(err => err)
    dispatch(actions.submit('projectForm.description', update$Q))

  }

  handleCancel() {
    window.location.reload()
  }

  render() {
    return (
      <Form model="projectForm.description" className="w-75" onSubmit={(description) => this.handleSubmit(description)}>
        <MarkdownEditAndPreview
          model="projectForm.description"
          text={this.props.text}>
        </MarkdownEditAndPreview>
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
  const bottom = (
    <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '12px' }}>
      <span className="font-italic">Markdown is supported</span>
      <Button className="h-50" color="none" size="sm" onClick={onEditButtonClick}>
        <i className="fa fa-pencil mr-1"></i>
        Edit
      </Button>
    </div>
  )
  return (
    <div className="my-4 p-3 border border-left-0 border-right-0 w-75">
      <MarkdownDisplay text={props.text}/>
      {props.user.data.email && bottom}
    </div>
  )
}

const ConnectedDescriptionDisplay = connect((state) => ({ user: state.user }))(DescriptionDisplay)

class MarkdownEditAndPreview extends React.Component {
  render() {
    const { text, model } = this.props
    return (
      <div>
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
            <Control.textarea className="w-100 border-0 bg-light p-2" rows={10} model={model}></Control.textarea>
          </TabPane>
          <TabPane tabId="2" className="p-2">
            <MarkdownDisplay text={text}></MarkdownDisplay>
          </TabPane>
        </TabContent>
      </div>
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: '1'
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }
}

const MarkdownDisplay = (props) => {
  const { text = '' } = props
  const html = md().render(text)
  return (
    <div dangerouslySetInnerHTML={{__html:html}} />
  )
}

const ConnectedProjectDetail = connect((state) => ({
  user: state.user,
  projectForm: state.projectForm
}))(ProjectDetail)

const ConnectedProjectNew = connect((state) => ({
  user: state.user,
  projectForm: state.projectForm
}))(withRouter(ProjectNew))

export {
  ConnectedProjectDetail as ProjectDetail,
  ConnectedProjectNew as ProjectNew
}
