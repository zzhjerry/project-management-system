const env = process.env.NODE_ENV

if (env !== 'development') {
  console.log('Need to set NODE_ENV to "development" to use this script')
  process.exit(1)
}

const factory = require('./server/integration/factory.js')
const _ = require('lodash')
const Q = require('bluebird')

const status = _.concat(_.fill(Array(3), 'new'), _.fill(Array(9), 'pending'))
var threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000
var threeDaysAgo = new Date(new Date().getTime() - threeDaysInMilliseconds)

const overrides = _.map(status, function (value, index) {
  var override = { status: value }
  if (index >= status.length - 3) {
    // create expired projects
    _.merge(override, { createdAt: threeDaysAgo })
  }
  return override
})

const createProjects$Q = _.map(overrides, function (override) {
  return factory.createProjectWithExperts$Q(override).then(function (record) {
    console.log('Created project ', record.title, 'with status ', record.status, '. Created at: ', record.createdAt)
  }).catch(console.log)
})

Q.all(createProjects$Q).then(function () {
  console.log('finished')
  process.exit(0)
})
