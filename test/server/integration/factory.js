const _ = require('lodash')
const models = require('../../../server/models.js')
const FactoryGirl = require('factory-girl')
const factory = FactoryGirl.factory
const adapter = new FactoryGirl.MongooseAdapter()
factory.setAdapter(adapter)

factory.define('user', models.User, {
  email: 'user@gmail.com',
  password: '12345678'
})

factory.define('project', models.Project, {
  status: _.nth(['new', 'pending'], _.random(0, 1)),
  title: factory.chance('sentence', { words: 5 }),
  description: factory.chance('paragraph')
})

factory.define('expert', models.Expert, {
  firstname: factory.chance('first'),
  lastname: factory.chance('last')
})

/**
 * Create a project with experts with status specified in override
 *
 * @param {Object} override - override default project title, description etc.
 * @return {Promise.<Project>}
 */
factory.createProjectWithExperts$Q = function (override) {
  // build 1 project with 3 experts
  const expertStatus = (override && override.expertStatus) || ['approved', 'approved', 'rejected']
  return factory.createMany('expert', expertStatus.length).then(function (experts) {
    const projectExperts = _.zipWith(expertStatus, experts, function (status, expert) {
      return { expert: expert.id, status: status }
    })
    override = _.pick(override, ['title', 'description', 'status', 'createdAt'])
    const data = _.merge({}, override, { experts: projectExperts })
    return factory.create('project', data)
  })
}

module.exports = factory
