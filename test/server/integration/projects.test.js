const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/highgarden-test', { useMongoClient: true })
const supertest = require('supertest')
require('it-each')({ testPerIteration: true })
const assert = require('chai').assert

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

    it('should return expert object', function () {
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
})
