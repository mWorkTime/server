const { Schema, model } = require('mongoose')

const roleSchema = new Schema({
  name: { type: String, trim: true, required: true, max: 32 },
  'role-code': { type: Number, required: true, index: true }
})

module.exports = model('Role', roleSchema)
