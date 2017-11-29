const _ = require('lodash')
const router = require('express').Router()
const User = require('./models.js').User

/**
 * User Creation
 */
router.post('/', function (req, res, next) {
  const credentials = _.pick(req.body, ['email', 'password'])
  const user = new User(credentials)
  const error = user.validateSync()
  const errors = _.get(error, 'errors')
  if (errors) {
    // error when password is invalid
    res.status(400)
    var getMessage = function (o) { return o.message }
    var message = _.mapValues(_.pick(errors, ['email.message', 'password.message']), getMessage)
    return res.json({ message: message })
  }
  return user.save().then(function (user) {
    req.login(user, function (err) {
      if (err) { return next(err) }
      return res.json({ email: user.email })
    })
  }).catch(function (err) {
    if (err.code === 11000) {
      // error when creating duplicate accounts
      res.status(400)
      return res.json({ message: 'email account already existed' })
    }
    // pass other errors to error handler
    next(err)
  })
})

/**
 * Get current user
 */
router.get('/current', function (req, res, next) {
  if (req.user) {
    return res.json({ email: req.user.email })
  } else {
    return res.status(404).end()
  }
})

module.exports = router
