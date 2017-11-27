const env = process.env.NODE_ENV

if (env !== 'development') {
  console.log('Need to set NODE_ENV to "development" to use this script')
  process.exit(1)
}

const factory = require('./server/integration/factory.js')
const _ = require('lodash')
const Q = require('bluebird')

const status = _.concat(_.fill(Array(3), 'new'), _.fill(Array(6), 'pending'))
const projects = _.map(status, function (value, index) {
  return {
    status: value
  }
})

const createProjects$Q = _.map(projects, function (project) {
  return factory.createProjectWithExperts$Q(project).then(function (record) {
    console.log('Created project ', record.title, 'with status ', record.status)
  }).catch(console.log)
})

Q.all(createProjects$Q).then(function () {
  console.log('finished')
  process.exit(0)
})
