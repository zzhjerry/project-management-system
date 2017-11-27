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
  const invalidPasswordError = _.get(error, 'errors.password')
  if (invalidPasswordError) {
    // error when password is invalid
    res.status(400)
    return res.json({ message: invalidPasswordError.message })
  }
  return user.save().then(function () {
    return res.json({ email: user.email })
  }).catch(function (err) {
    if (err.code === 11000) {
      // error when creating duplicate accounts
      res.status(400)
      return res.json({ message: 'email account already existed' })
    }
    // pass other errors to error handler
    throw err
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
