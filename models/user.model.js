const { model, Schema, Types } = require('mongoose')
const { hashedPassword } = require('../utils/hashed-password')

const userSchema = new Schema({
  name: { type: String, trim: true, required: true, max: 32 },
  surname: { type: String, trim: true, max: 32 },
  email: { type: String, trim: true, required: true, unique: true, lowercase: true },
  hashed_password: { type: String, required: true
  },
  phone: String,
  isOwner: { type: Boolean, required: true, default: false
  },
  isSacked: { type: Boolean, required: true, default: false },
  gender: { type: String, default: 'unknown' },
  department: { type: Object },
  role: { type: Object },
  isVerified: { type: Boolean, default: false },
  salt: String,
  tasks: [{ type: Types.ObjectId, ref: 'Task' }],
  onReview: [{ type: Object }],
  resetPasswordLink: { data: String, default: '' },
  organization: { type: Types.ObjectId, ref: 'Organization' }
}, { timestamps: true })

userSchema.virtual('password')
  .set(function (password) {
    // create a temporary variable called _password
    this._password = password
    // generate salt
    this.salt = this.makeSalt()
    // encryptPassword
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return hashedPassword(password, this.salt)
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ''
  }
}

module.exports = model('User', userSchema)
