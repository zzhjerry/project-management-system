const express = require('express')
var app = express()
app.use(require('cookie-parser')())
app.use(require('body-parser').json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

// Initialize Passport and restore authentication state, if any, from the
// session.
const passport = require('passport')
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', require('./auth.js'))
app.use('/api/users', require('./users.js'))

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
