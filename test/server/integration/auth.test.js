const supertest = require('supertest')

const app = require('../../../server/index.js')

describe('Auth test', function () {
  describe('GET /api/login', function () {
    it('should respond with 405', function () {
      return supertest(app).get('/api/login').expect(405)
    })
  })

  describe('PUT /api/login', function () {
    it('should respond with 405', function () {
      return supertest(app).put('/api/login')
        .send({ username: 'u', password: 'p' })
        .expect(405)
    })
  })

  describe('DELETE /api/login', function () {
    it('should respond with 405', function () {
      return supertest(app).delete('/api/login').expect(405)
    })
  })

  describe('POST /api/login', function () {
    it('should succeed and redirect to /dashboard if valid', function () {
      return supertest(app).post('/api/login')
        .send({ username: 'eric', password: '12345678' })
        .expect('Location', /\/dashboard/)
        .expect(302)
    })

    it('should fail with 401 if invalid', function () {
      return supertest(app).post('/api/login')
        .send({ username: 'eric', password: '123456' })
        .expect(401)
    })
  })
})
