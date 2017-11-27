const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const slugify = require('slug')

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
    default: 'new',
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: 'Title is required',
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  experts: [{
    expert: {
      type: Schema.Types.ObjectId,
      ref: 'Expert'
    },
    status: {
      type: String,
      enum: ['approved', 'rejected']
    }
  }]
}, {
  timestamps: true
})

projectSchema.pre('validate', function (next) {
  if (this.isModified('slug')) {
    // create validation error if slug is modified
    this.invalidate('slug', 'slug cannot be changed')
  }
  next()
})

projectSchema.pre('save', function (next) {
  // make sure slug doesn't change on saving if it exists.
  // if it doesn't exist, create one with slugified title + epoch timestamp
  this.slug = this.slug || slugify(this.title) + '-' + new Date().getTime()
  next()
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
