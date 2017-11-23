const _ = require('lodash')
const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const LocalStrategy = require('passport-local').Strategy
const models = require('./models.js')
const User = models.User

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err) }
    if (!user) {
      return done(null, false, { message: 'Incorrect email account.' })
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' })
    }
    return done(null, user)
  })
}))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  User.findOne({ id: id }, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

var app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())

app.post('/api/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // *** Display message without using flash option
      // re-render the login form with a message
      res.status(401)
      return res.json(info)
    }
    req.logIn(user, function (err) {
      if (err) { return next(err) }
      return res.redirect('/dashboard')
    })
  })(req, res, next)
})

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
