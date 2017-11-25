# Project Management System

## Architecture

### Backend (`/server`)

All `post` request should use `json` as format (i.e. Send `Content-Type: application/json` in the header)

API endpoints are grouped under `/api` url with following routes:

**POST `/api/auth/login`**: 302

redirect user to `/dashboard`. Assign a session that expires in 2 weeks.

**GET `/api/auth/logout`**: 302

redirect user to `/`. Clear `req.user`, doesn't clear session.

**POST `/api/users`**: 302

redirect user to `/dashboard`. Create user in DB

**GET `/api/projects`**: 200

get a list of projects with an array of assigned experts with corresponding status

**POST `/api/projects`**: 201

create a project

**PUT `/api/projects/:slug`**: 201

Update title, description, approve, reject experts.

**All other routes and request methods not listed above will return 404**

## Dev Notes

### Prerequisites

Assume you have following softwares installed, if not, see link behind for instruction

- MongoDB ([install](https://docs.mongodb.com/manual/administration/install-community/)): `mongod` is needed to start `development` and `testing` database

### Choice of libraries

- Util: [lodash](https://lodash.com/docs/4.17.4)
- Promise: [bluebird](http://bluebirdjs.com/docs/getting-started.html)
- Linting: [eslint](https://eslint.org/) and [standard](https://github.com/standard/standard)
- Test framework: [mocha](https://mochajs.org/))
- API Integration test: [supertest](https://github.com/visionmedia/supertest)
- Assertion Library: [chai/assert](http://chaijs.com/api/assert/)

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

## Change log

#### v0.1.0 - 20171124 (@jerry)
* ADD: auth logic and 18 test
