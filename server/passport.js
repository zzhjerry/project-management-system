// Initialize Passport and restore authentication state, if any, from the
// session.
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models.js').User
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) { return done(err) }
    if (!user) {
      return done(null, false, {
        email: 'Email account doesn\'t exist'
      })
    }
    return user.validPassword(password).then(function (res) {
      if (res) {
        return done(null, user)
      } else {
        return done(null, false, {
          password: 'Incorrect password.'
        })
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
  User.findOne({ _id: id }, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

module.exports = passport
