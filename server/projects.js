const router = require('express').Router()
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

module.exports = router
