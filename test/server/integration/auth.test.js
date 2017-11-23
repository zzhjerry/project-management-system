const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/highgarden-test', { useMongoClient: true })
const supertest = require('supertest')
require('it-each')({ testPerIteration: true })
const bcrypt = require('bcrypt')
const assert = require('chai').assert

const factory = require('./factory.js')
const app = require('../../../server/index.js')

describe('Login test', function () {
  beforeEach(function () {
    return factory.create('user')
  })

  afterEach(function () {
    return mongoose.connection.db.dropCollection('users')
  })

  describe('GET /api/login', function () {
    it('should respond 404', function () {
      return supertest(app).get('/api/login').expect(404)
    })
  })

  describe('PUT /api/login', function () {
    it('should respond 404', function () {
      return supertest(app).put('/api/login')
        .send({ email: 'u', password: 'p' })
        .expect(404)
    })
  })

  describe('DELETE /api/login', function () {
    it('should respond 404', function () {
      return supertest(app).delete('/api/login').expect(404)
    })
  })

  describe('POST /api/login', function () {
    var user
    beforeEach(function () {
      user = { email: 'user@gmail.com', password: '12345678' }
    })

    it('should succeed and redirect to /dashboard if valid', function () {
      return supertest(app).post('/api/login')
        .send(user)
        .expect('Location', /\/dashboard/)
        .expect(302)
    })

    it('should respond 401 and send invalid password message', function () {
      user.password = '123455'
      return supertest(app).post('/api/login')
        .send(user)
        .expect(401, { message: 'Incorrect password.' })
    })

    it('should respond 401 and send invalid email account message', function () {
      user.email = 'no-one@gmail.com'
      return supertest(app).post('/api/login')
        .send(user)
        .expect(401, { message: 'Incorrect email account.' })
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
        .send({ email: 'u@g.com', password: 'p' })
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
        return mongoose.connection.db.createCollection('users')
      })
    })

    afterEach(function () {
      return mongoose.connection.db.dropCollection('users')
    })

    it('should redirect to /dashboard on success', function () {
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(302)
        .expect('Location', /\/dashboard/)
    })

    it('should respond 400 with validation error on short password', function () {
      user.password = 'short'
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(400, { message: 'password should be at least 8 characters long' })
    })

    it('should respond 400 with validation error on invalid password', function () {
      user.password = '12345@$@'
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(400, { message: 'password should only contain letters and numbers' })
    })

    it('should respond 400 with error message on creating duplicate user', function () {
      return factory.create('user').then(function () {
        // When the first model is saved, index may not exist. So we need to wait
        // for index to be created to test creating duplicate model
        return mongoose.model('User').ensureIndexes().then(function () {
          return supertest(app).post('/api/signup')
            .send(user)
            .expect(400, { message: 'email account already existed' })
        })
      })
    })

    const invalidEmails = ['user@gmail', 'user.com', 'user']
    let message = 'should respond 400 with error message on invalid email - %s'
    it.each(invalidEmails, message, ['element'], function (email) {
      user.email = email
      return supertest(app).post('/api/signup')
        .send(user)
        .expect(400, { message: 'email address is not valid' })
    })
  })

  describe('Password encoding', function () {
    it('should be encoded when saving to database', function () {
      return factory.create('user', { password: '12345678' })
        .then(function (record) {
          assert.notEqual(record.password, '12345678')
          return bcrypt.compare('12345678', record.password).then(function (res) {
            assert.isTrue(res)
            return mongoose.connection.db.dropCollection('users')
          })
        })
    })
  })
})
