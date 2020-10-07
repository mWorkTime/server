const { model, Schema, Types } = require('mongoose')
const crypto = require('crypto')

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    trim: true,
    required: true,
    max: 10,
    unique: true,
    index: true,
    lowercase: true
  },
  phone: String,
  isOwner: {
    type: Boolean,
    required: true,
    default: false
  },
  role: {
    type: Number,
    trim: true,
    default: 0
  },
  salt: String,
  resetPasswordLink: {
    data: String,
    default: ''
  },
  organization: {
    type: Types.ObjectId,
    ref: 'Organization'
  }
}, { timestamp: true })

userSchema.virtual('password')
  .set(function (password) {
    // create a temporary variable called _password
    this._password = password
    // generate salt
    this.salt = this.makeSalt()
    // encryptPassword
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  }
}

module.exports = model('User', userSchema)
