const models = require('../../../server/models.js')
const FactoryGirl = require('factory-girl')
const factory = FactoryGirl.factory
const adapter = new FactoryGirl.MongooseAdapter()
factory.setAdapter(adapter)

factory.define('user', models.User, {
  username: 'user',
  email: 'user@gmail.com',
  password: '12345678'
})

factory.define('project', models.Project, {
  status: 'new',
  title: 'project title',
  experts: []
})

factory.define('expert', models.Expert, {
  firstname: factory.chance('first'),
  lastname: factory.chance('last')
})

module.exports = factory
