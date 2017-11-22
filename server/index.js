const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const models = require('./models.js')
const User = models.User

passport.use(new LocalStrategy(function (username, password, done) {
  const findUser$Q = User.findOne({ username: username }).exec()
  findUser$Q.then(function (err, user) {
    // when server error happens e.g. issue with db connection
    if (err) done(err)
    // when user is not found
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }
    // when password is incorrect
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password' })
    }
    // success
    return done(null, user)
  })
}))

var app = express()

app.post('/api/login', passport.authenticate('local', {
  successRedirect: '/dashboard'
}), function (req, res, err) {
})

module.exports = app
