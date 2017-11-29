# Project Management System

## Architecture

### Backend (`/server`)

All `post` request should use `json` as format (i.e. Send `Content-Type: application/json` in the header)

API endpoints are grouped under `/api` url with following routes:

**POST `/api/auth/login`**: 200

return user's profile e.g. `{ email: user.email}`. Assign a session that expires in 2 weeks.

**GET `/api/auth/logout`**: 200

redirect user to `/`. Clear `req.user`, doesn't clear session.

**POST `/api/users`**: 200

return user's profile e.g. `{ email: user.email}`

**GET `/api/projects`**: 200

get a list of projects with an array of assigned experts with corresponding status

**POST `/api/projects`**: 201

create a project

**PUT `/api/projects/:slug`**: 200

Update title, description

Approve / Reject experts.

**Other routes and request methods to `/api/*` not listed above will return 404**

#### Choice of libraries

- Util: [lodash](https://lodash.com/docs/4.17.4)
- Promise: [bluebird](http://bluebirdjs.com/docs/getting-started.html)
- Linting: [eslint](https://eslint.org/) and [standard](https://github.com/standard/standard)
- Test framework: [mocha](https://mochajs.org/))
- API Integration test: [supertest](https://github.com/visionmedia/supertest)
- Assertion Library: [chai/assert](http://chaijs.com/api/assert/)


### Frontend (`/app`)

#### Routes:

**`/`**:

- login or go to `/signup`
- redirect user to `/dashboard` if a user is already logged in or after logging in

**`/signup`**:

- signup or go to `/` (login)
- redirect user to `/dashboard` after a user sign up

**`/dashboard`**

- display a list of projects with `new`, `pending` and creation time
- display `approved` experts by toggling button
- if user is not authenticated, redirect them to `/` (login)

**`/projects/:slug`**

- display a project's detail
- if a user is logged in, allow them to edit project's `title`, `description`, approve/reject `experts`
- if a user is NOT logged in, only display `title`, `description`, `experts`

**`/new-project`**

- allow authenticated user to create a new project
- redirect anonymouse user to `/` (login)

#### Choice of libraries

- Framework: [React](https://reactjs.org/)
- Frontend Routing: [React-Router](https://reacttraining.com/react-router/web/example/basic)
- State Management: [Redux](https://redux.js.org/docs/advanced/UsageWithReactRouter.html)
- Async Action Creator: [Redux Thunk Middleware](https://github.com/gaearon/redux-thunk)
- CSS Components: [Reactstrap](https://reactstrap.github.io/)
- CSS Framework: [Bootstrap@4](https://getbootstrap.com/) and [Font Awesome](http://fontawesome.io/icons/)
- Ajax Library: [superagent](http://visionmedia.github.io/superagent/)
- Form Management: [react-redux-form](https://davidkpiano.github.io/react-redux-form/)
- Structure setup: [create-react-app](https://github.com/facebookincubator/create-react-app)
- Markdown Generation: [markdown-it](https://github.com/markdown-it/markdown-it)
- Loading Icon: [react-loading](https://github.com/fakiolinho/react-loading)

## Dev Notes

### Prerequisites

Assume you have following softwares installed, if not, see link behind for instruction

- MongoDB ([install](https://docs.mongodb.com/manual/administration/install-community/)): `mongod` is needed to start `development` and `testing` database

### Data Models

> User

- **email (string, required)**: account to login
- **password (string, required)**: minimum 8 chars, encrypted with `bcrypt`

> Project

- **status (string, required, default:new)**: new, pending, expired
- **title (string, required)**: project title
- **slug (string, required)**: slugified version of project title + epoch timestamp

`slug` is used to prettify url of a project's detail view. It will be used to query project document.
It is unique and cannot be changed once the document is created. A validation error will occur if someone tries to
`POST` a different slug to `/api/projects/:slug` endpoint.

- **experts (array, optional)**: an array of choosen experts for the choosen project with status in following schema

I use reference to store `expert` in `experts` because it saves more space as the growth of number of projects,
number of experts per project and expert profile length.

``` javascript
{
  expert: ObjectId,
  status: ["approved", "rejected"]
}
```

> Expert

- **firstname (string, required)**
- **lastname (string, optional**

### Authentication

**session based authentication (instead of token based authentication)**

Token based authentication (JWT) is the new trend and has various advantages introduced
[here](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/). But considering
that this system is intended to be used by internal staffs instead of millions of
users outside and both frontend and backend will
be served on the same domain, session based authentication is enough to handle
necessary requirements.

**implementation of session based authentication**

Inspired by [this artical](https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359).
Also use [passport](http://www.passportjs.org/docs/) as it's reliable and can be configured for
various other authentication needs.

## TODOS

- [ ] Protect api endpoints with necessary authorization
- [ ] Project Form Error handling
- [ ] Codeceptjs e2e test
- [ ] Add experts to project
- [ ] Mobile support
- [ ] Add a button that change `new` projects to `pending`?

## Change log

#### v0.2.0 - 20171126 (@jerry)
* ADD: /api/projects endpoints and 30 tests
#### v0.1.0 - 20171124 (@jerry)
* ADD: auth logic and 18 test
