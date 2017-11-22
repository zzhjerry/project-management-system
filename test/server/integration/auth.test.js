const supertest = require('supertest')

const factory = require('./factory.js')
const app = require('../../../server/index.js')

describe('Auth test', function () {
  beforeEach(function () {
    return factory.create('user', { username: 'user', password: '12345678' })
  })

  afterEach(function () {
    return factory.cleanUp()
  })

  describe('GET /api/login', function () {
    it('should respond with 404', function () {
      return supertest(app).get('/api/login').expect(404)
    })
  })

  describe('PUT /api/login', function () {
    it('should respond with 404', function () {
      return supertest(app).put('/api/login')
        .send({ username: 'u', password: 'p' })
        .expect(404)
    })
  })

  describe('DELETE /api/login', function () {
    it('should respond with 404', function () {
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

    it('should fail with 401 if invalid', function () {
      return supertest(app).post('/api/login')
        .send({ username: 'user', password: '123456' })
        .expect(401)
    })
  })
})
