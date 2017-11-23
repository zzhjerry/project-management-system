const supertest = require('supertest')

const factory = require('./factory.js')
const app = require('../../../server/index.js')

describe('Login test', function () {
  beforeEach(function () {
    return factory.create('user', { username: 'user', password: '12345678' })
  })

  afterEach(function () {
    return factory.cleanUp()
  })

  describe('GET /api/login', function () {
    it('should respond 404', function () {
      return supertest(app).get('/api/login').expect(404)
    })
  })

  describe('PUT /api/login', function () {
    it('should respond 404', function () {
      return supertest(app).put('/api/login')
        .send({ username: 'u', password: 'p' })
        .expect(404)
    })
  })

  describe('DELETE /api/login', function () {
    it('should respond 404', function () {
      return supertest(app).delete('/api/login').expect(404)
    })
  })

  describe('POST /api/login', function () {
    it('should succeed and redirect to /dashboard if valid', function () {
      return supertest(app).post('/api/login')
        .send({ username: 'user', password: '12345678' })
        .expect('Location', /\/dashboard/)
        .expect(302)
    })

    it('should respond 401 and send invalid password message', function () {
      return supertest(app).post('/api/login')
        .send({ username: 'user', password: '123456' })
        .expect(401, { message: 'Incorrect password.' })
    })

    it('should respond 401 and send invalid username message', function () {
      return supertest(app).post('/api/login')
        .send({ username: 'noone', password: '123456' })
        .expect(401, { message: 'Incorrect username.' })
    })
  })
})

describe('Sign up test', function () {
  describe('GET /api/signup', function () {
    it('should respond 404', function () {
      return supertest(app).get('/api/signup').expect(404)
    })
  })

  describe('PUT /api/signup', function () {
    it('should respond 404', function () {
      return supertest(app).put('/api/signup')
        .send({ username: 'u', password: 'p' })
        .expect(404)
    })
  })

  describe('DELETE /api/signup', function () {
    it('should respond 404', function () {
      return supertest(app).delete('/api/signup').expect(404)
    })
  })

  describe('POST /api/signup', function () {
    var user
    beforeEach(function () {
      return factory.build('user').then(function (record) {
        user = record._doc
      })
    })

    afterEach(function () {
      return factory.cleanUp()
    })

    it('should respond 400 with validation error on invalid password', function () {
      user.password = '12345@$@'
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(400, { message: 'password should only contain letters and numbers' })
    })

    it('should respond 400 with validation error on short password', function () {
      user.password = 'short'
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(400, { message: 'password should be at least 8 characters long' })
    })

    it('should respond 400 with error message on creating duplicate user', function () {
      return factory.create('user')
        .then(function () {
          return supertest(app).post('/api/signup')
            .send(user)
            .expect(400, { message: 'username already existed' })
        })
    })

    it('should redirect to /dashboard on success', function () {
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(302)
        .expect('Location', /\/dashboard/)
    })
  })
})
