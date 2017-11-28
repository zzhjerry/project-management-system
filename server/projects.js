const router = require('express').Router()
const _ = require('lodash')
const Project = require('./models.js').Project

router.get('/', function (req, res, next) {
  return Project.find({}).populate({ path: 'experts.expert' }).exec()
    .then(function (projects) {
      return res.json(projects)
    })
    .catch(next)
})

router.post('/', function (req, res, next) {
  const data = _.pick(req.body, ['title', 'description'])
  const project = new Project(data)
  return project.save().then(function (project) {
    return res.status(201).json(project)
  }).catch(next)
})

router.put('/:slug', function (req, res, next) {
  const data = _.pick(req.body, ['title', 'description', 'expert'])
  // update expert status, accept expert as string and object
  if (data.expert) {
    var expertId = data.expert._id
    var status = data.expert.status
    return Project.findOneAndUpdate(
      { slug: req.params.slug, 'experts.expert': expertId },
      {
        '$set': {
          'experts.$.status': status
        }
      },
      { new: true }
    ).exec().then(res.json.bind(res)).catch(next)
  }
  return Project.findOneAndUpdate({ slug: req.params.slug }, data, { new: true })
    .exec()
    .then(res.json.bind(res))
    .catch(next)
})

router.get('/:slug', function (req, res, next) {
  return Project.findOne({ slug: req.params.slug })
    .populate({ path: 'experts.expert' })
    .then(res.json.bind(res))
    .catch(next)
})

/**
 * Handle errors when unique rule is violated or validation error happened.
 */
router.use(function (err, req, res, next) {
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Title already exists' })
  }
  if (!err.errors) return next(err)
  // got validation error
  return res.status(400).json(err.errors)
})

module.exports = router
