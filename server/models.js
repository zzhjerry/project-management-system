const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema

const env = process.env.NODE_ENV
const suffix = env || 'development'
const uri = `mongodb://localhost:27017/highgarden-${suffix}`
mongoose.connect(uri, { useMongoClient: true })

/* Schema definition */
const userSchema = new Schema({
  username: {
    type: String,
    required: 'username is required',
    unique: true
  },
  email: {
    type: String,
    required: 'email is required',
    trim: true
  },
  password: {
    type: String,
    required: 'password is required',
    minlength: [8, 'password should be at least 8 characters long'],
    validate: {
      validator: function (value) {
        return /[A-Za-z0-9]+/.test(value)
      },
      message: 'password should only contain letters and numbers'
    }
  }
})

/**
 * Validate password is correct
 *
 * @param {string} password - the password to be validated
 * @return {boolean}
 */
userSchema.methods.validPassword = function (password) {
  return this.password === password
}

// Encrypt password before save
userSchema.pre('save', function (next) {
  // TODO: bcrypt password
  next()
})

const projectSchema = new Schema({
  status: {
    type: String,
    enum: ['new', 'pending', 'expired'],
    required: true
  },
  title: {
    type: String,
    required: true
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
