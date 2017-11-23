const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const env = process.env.NODE_ENV
const suffix = env || 'development'
const uri = `mongodb://localhost:27017/highgarden-${suffix}`
mongoose.connect(uri, { useMongoClient: true })

/* Schema definition */
const userSchema = new Schema({
  email: {
    type: String,
    required: 'email is required',
    unique: true,
    match: [/^.*@.*\..*$/, 'email address is not valid'], // email should have @ and .
    trim: true
  },
  password: {
    type: String,
    required: 'password is required',
    minlength: [8, 'password should be at least 8 characters long'],
    match: [/^[A-Za-z0-9]+$/, 'password should only contain letters and numbers']
  }
})

/**
 * Validate password is correct
 *
 * @param {string} password - the password to be validated
 * @return {boolean}
 */
userSchema.methods.validPassword = function (password) {
  const user = this
  return bcrypt.compare(password, user.password).then(_.identity)
}

// Encrypt password before save
userSchema.pre('save', function (next) {
  const user = this
  return bcrypt.hash(user.password, 10).then(function (hash) {
    user.password = hash
    next()
  }).catch(next)
})

const projectSchema = new Schema({
  status: {
    type: String,
    enum: ['new', 'pending', 'expired'],
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  experts: [Schema.Types.ObjectId]
})

const expertSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
})

/* Model definition */
const models = {}
models.User = mongoose.model('User', userSchema)
models.Project = mongoose.model('Project', projectSchema)
models.Expert = mongoose.model('Expert', expertSchema)

module.exports = models
