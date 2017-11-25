const router = require('express').Router()
const _ = require('lodash')
const Project = require('./models.js').Project

router.get('/', function (req, res, next) {
  return Project.find({}).populate({ path: 'experts.expert' }).exec()
    .then(function (projects) {
      return res.json(projects)
    })
    .catch(function (err) {
      // pass to error handler
      throw err
    })
})

router.post('/', function (req, res, next) {
  const data = _.pick(req.body, ['title', 'description'])
  const project = new Project(data)
  return project.save().then(function (project) {
    return res.status(201).json(project)
  }).catch(function (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Title already exists' })
    }
    if (!err.errors) throw err
    // got validation error
    return res.status(400).json(err.errors)
  })
})

module.exports = router
