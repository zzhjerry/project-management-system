const router = require('express').Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models.js').User

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err) }
    if (!user) {
      return done(null, false, { message: 'Incorrect email account.' })
    }
    return user.validPassword(password).then(function (res) {
      if (res) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect password.' })
      }
    })
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

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // *** Display message without using flash option
      // re-render the login form with a message
      res.status(401)
      return res.json(info)
    }
    // login() method is added by passport
    req.login(user, function (err) {
      if (err) { return next(err) }
      const redirect = encodeURIComponent('/dashboard')
      return res.redirect('/?redirect=' + redirect)
    })
  })(req, res, next)
})

router.get('/logout', function (req, res, next) {
  // logout() method is added by passport
  req.logout()
  return res.redirect('/')
})

module.exports = router
