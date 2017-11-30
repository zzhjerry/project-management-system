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
    // use mongoose's default validation error format, see here for details:
    // http://mongoosejs.com/docs/validation.html
    // Error is keyed by field name so frontend can map them to each input field
    // see here: https://davidkpiano.github.io/react-redux-form/docs/guides/validation.html
    // and read doc about submitFields function
    var errorWithOnlyMessage = _.mapValues(errors, function (error) {
      return error.message
    })
    res.status(400)
    return res.json(errorWithOnlyMessage)
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
      return res.json({ message: 'This email account has been taken' })
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
