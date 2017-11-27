const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/highgarden-test', { useMongoClient: true })
const supertest = require('supertest')

const factory = require('./factory.js')
const app = require('../../../server/index.js')

describe('Auth / login', function () {
  beforeEach(function () {
    return factory.create('user')
  })

  afterEach(function () {
    return mongoose.connection.db.dropCollection('users')
  })

  describe('GET /api/auth/login', function () {
    it('should respond 404', function () {
      return supertest(app).get('/api/auth/login').expect(404)
    })
  })

  describe('PUT /api/auth/login', function () {
    it('should respond 404', function () {
      return supertest(app).put('/api/auth/login')
        .send({ email: 'u', password: 'p' })
        .expect(404)
    })
  })

  describe('DELETE /api/auth/login', function () {
    it('should respond 404', function () {
      return supertest(app).delete('/api/auth/login').expect(404)
    })
  })

  describe('POST /api/auth/login', function () {
    var user
    beforeEach(function () {
      user = { email: 'user@gmail.com', password: '12345678' }
    })

    it('should succeed and return email if valid', function () {
      return supertest(app).post('/api/auth/login')
        .send(user)
        .expect(200, { email: user.email })
    })

    it('should respond 401 and send invalid password message', function () {
      user.password = '123455'
      return supertest(app).post('/api/auth/login')
        .send(user)
        .expect(401, { message: 'Incorrect password.' })
    })

    it('should respond 401 and send invalid email account message', function () {
      user.email = 'no-one@gmail.com'
      return supertest(app).post('/api/auth/login')
        .send(user)
        .expect(401, { message: 'Incorrect email account.' })
    })
  })
})

describe('Auth / logout', function () {
  describe('GET /api/auth/logout', function () {
    it('should return 200 on success', function () {
      return supertest(app).get('/api/auth/logout')
        .expect(200)
    })
  })
})
