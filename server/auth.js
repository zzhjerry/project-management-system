module.exports = function (passport) {
  const router = require('express').Router()

  router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        res.status(401)
        return res.json(info)
      }
      // login() method is added by passport
      req.login(user, function (err) {
        if (err) { return next(err) }
        return res.redirect('/dashboard')
      })
    })(req, res, next)
  })

  router.get('/logout', function (req, res, next) {
    // logout() method is added by passport
    req.logout()
    return res.redirect('/')
  })

  return router
}
