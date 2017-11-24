const _ = require('lodash')
const express = require('express')
const User = require('./models.js').User

var app = express()
app.use(require('cookie-parser')())
app.use(require('body-parser').json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

// Initialize Passport and restore authentication state, if any, from the
// session.
const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', require('./auth'))

app.post('/api/signup', function (req, res, next) {
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
    return res.redirect('/dashboard')
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
 * Catch-all error handler middleware
 */
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.json({
    _stack: err.stack
  })
})

if (require.main === module) {
  var port = process.env.PORT || 9000
  app.listen(port, function (_err) {
    console.log('Listening on ' + port)
  })
} else {
  module.exports = app
}
