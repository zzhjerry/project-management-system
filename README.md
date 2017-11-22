# Project Management System

## Architecture

### Backend (`/server`)

API endpoints are grouped under `/api` url with following routes:

> `/api/login` (POST)

- POST

Success (status code: 302): redirect user to `/dashboard`. Assign a session that expires in 2 weeks.
Fail (status code: 401): "Invalid username or password"

- GET, PUT, DELETE

Fail (status code: 405)

## Dev Notes

### Prerequisites

Assume you have following softwares installed, if not, see link behind for instruction

- MongoDB ([install](https://docs.mongodb.com/manual/administration/install-community/))

### Choice of libraries

- Util: [lodash](https://lodash.com/docs/4.17.4)
- Promise: [bluebird](http://bluebirdjs.com/docs/getting-started.html)
- Linting: [eslint](https://eslint.org/) and [standard](https://github.com/standard/standard)
- Test framework: [mocha](https://mochajs.org/))
- API Integration test: [supertest](https://github.com/visionmedia/supertest)

### Data Models

> User

- **username (string, required)**: minimum 8 chars
- **password (string, required)**: encrypted with `bcrypt`

> Project

- **status (string, required, default:new)**: new, pending, expired
- **title (string, required)**: project title
- **experts (array, optional)**: a list of choosen experts for the choosen project

> Expert

- **firstname (string, required)**
- **lastname (string, optional**

### Authentication

- session based authentication (instead of token based authentication)

Token based authentication (JWT) is the new trend and has various advantages introduced
[here](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/). But consider
that this is a project management system that is intended to be used by internal
staffs instead of millions of users outside, and both frontend and backend will
be served on the same domain, session based authentication is enough to handle
all requirements.

- implementation of session based authentication

Although it's possible to build a plain "hand written" authentication flow following
[this artical](https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359),
I decided to use [passport](http://www.passportjs.org/docs/) as it's quite reliable and mature for
various authentication needs.
