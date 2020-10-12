const { model, Schema, Types } = require('mongoose')

const tokenSchema = new Schema({
  _userId: { type: Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: true, expires: 86400 }
})

module.exports = model('Token', tokenSchema)
