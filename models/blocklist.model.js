const { Schema, model } = require('mongoose')

const blockListSchema = new Schema({
  token: {
    type: String,
    unique: true
  },
  createAt: {
    type: Date,
    expires: 86400,
    default: Date.now(),
    index: true
  }
})

module.exports = model('BlockList', blockListSchema)
