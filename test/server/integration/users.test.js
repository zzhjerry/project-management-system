const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/highgarden-test', { useMongoClient: true })
const supertest = require('supertest')
require('it-each')({ testPerIteration: true })
const bcrypt = require('bcrypt')
const assert = require('chai').assert

const factory = require('./factory.js')
const app = require('../../../server/index.js')

describe('Users', function () {
  describe('GET /api/users', function () {
    it('should respond 404', function () {
      return supertest(app).get('/api/users').expect(404)
    })
  })

  describe('PUT /api/users', function () {
    it('should respond 404', function () {
      return supertest(app).put('/api/users')
        .send({ email: 'u@g.com', password: 'p' })
        .expect(404)
    })
  })

  describe('DELETE /api/users', function () {
    it('should respond 404', function () {
      return supertest(app).delete('/api/users').expect(404)
    })
  })

  describe('POST /api/users', function () {
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
      return supertest(app).post('/api/users')
        .send(user)
        .expect(302)
        .expect('Location', '/dashboard')
    })

    it('should respond 400 with validation error on short password', function () {
      user.password = 'short'
      return supertest(app).post('/api/users')
        .send(user)
        .expect(400, { message: 'password should be at least 8 characters long' })
    })

    it('should respond 400 with validation error on invalid password', function () {
      user.password = '12345@$@'
      return supertest(app).post('/api/users')
        .send(user)
        .expect(400, { message: 'password should only contain letters and numbers' })
    })

    it('should respond 400 with error message on creating duplicate user', function () {
      return factory.create('user').then(function () {
        // When the first model is saved, index may not exist. So we need to wait
        // for index to be created to test creating duplicate model
        return mongoose.model('User').ensureIndexes().then(function () {
          return supertest(app).post('/api/users')
            .send(user)
            .expect(400, { message: 'email account already existed' })
        })
      })
    })

    const invalidEmails = ['user@gmail', 'user.com', 'user']
    let message = 'should respond 400 with error message on invalid email - %s'
    it.each(invalidEmails, message, ['element'], function (email) {
      user.email = email
      return supertest(app).post('/api/users')
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
