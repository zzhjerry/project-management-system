const path = require('path')
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

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../app', 'build')))

app.use('/api/auth', require('./auth.js'))
app.use('/api/users', require('./users.js'))
app.use('/api/projects', require('./projects.js'))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../app', 'build', 'index.html'))
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
