const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/highgarden-test', { useMongoClient: true })
const supertest = require('supertest')
require('it-each')({ testPerIteration: true })
const assert = require('chai').assert
const slugify = require('slug')

const factory = require('./factory.js')
const app = require('../../../server/index.js')

function createOneProjectWithThreeExperts$Q () {
  // build 1 project with 3 experts
  return factory.createMany('expert', 3).then(function (experts) {
    const projectExperts = _.zipWith(['approved', 'approved', 'rejected'], experts, function (status, expert) {
      return { expert: expert.id, status: status }
    })
    return factory.create('project', { experts: projectExperts })
  })
}

describe('Projects', function () {
  describe('GET /api/projects', function () {
    afterEach(function () {
      assert.match(mongoose.connection.db.s.databaseName, /test/, 'DANGER: not using testing database')
      return mongoose.connection.db.dropDatabase()
    })

    it('should return all projects', function () {
      return createOneProjectWithThreeExperts$Q().then(function () {
        return supertest(app).get('/api/projects')
          .expect(200)
          .expect(function (res) {
            assert.equal(res.body.length, 1)
          })
      })
    })

    it('should return expert object instead of id', function () {
      return createOneProjectWithThreeExperts$Q().then(function () {
        return supertest(app).get('/api/projects')
          .expect(200)
          .expect(function (res) {
            assert.equal(res.body[0].experts.length, 3)
            assert.isObject(res.body[0].experts[0].expert, 'expert is not populated')
          })
      })
    })

    it('should not return [] if no expert assigned', function () {
      return factory.create('project').then(function () {
        return supertest(app).get('/api/projects')
          .expect(200)
          .expect(function (res) {
            assert.deepEqual(res.body[0].experts, [])
          })
      })
    })
  })

  describe('POST /api/projects', function () {
    let body
    beforeEach(function () {
      body = { title: 'meow', description: 'some text' }
    })

    afterEach(function () {
      assert.match(mongoose.connection.db.s.databaseName, /test/, 'DANGER: not using testing database')
      return mongoose.connection.db.dropDatabase()
    })

    it('should respond 400 with validation error on duplicate title', function () {
      return factory.create('project', { title: 'meow' }).then(function () {
        return mongoose.model('Project').ensureIndexes().then(function () {
          return supertest(app).post('/api/projects')
            .send(body)
            .expect(400, { message: 'Title already exists' })
        })
      })
    })

    it('should success with 201, set status to "new" and return created object', function () {
      return supertest(app).post('/api/projects')
        .send(body)
        .expect(201)
        .expect(function (res) {
          assert.isObject(res.body)
          assert.equal(res.body.title, 'meow')
          assert.equal(res.body.status, 'new')
        })
    })

    it('should only use title and description form post body', function () {
      const extendedBody = _.merge({}, body, { slug: 'meow-12345', status: 'approved' })
      return supertest(app).post('/api/projects')
        .send(extendedBody)
        .expect(201)
        .expect(function (res) {
          assert.equal(res.body.title, extendedBody.title)
          assert.equal(res.body.description, extendedBody.description)
          assert.equal(res.body.status, 'new')
          assert.notEqual(res.body.status, extendedBody.status)
          assert.notEqual(res.body.slug, extendedBody.slug)
        })
    })

    it('should create slug from title', function () {
      return supertest(app).post('/api/projects')
        .send(body)
        .expect(201)
        .expect(function (res) {
          assert.isObject(res.body)
          const regexp = slugify(res.body.title) + '-\\d+'
          assert.match(res.body.slug, new RegExp(regexp))
        })
    })
  })
})
