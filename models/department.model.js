const { model, Schema } = require('mongoose')

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 32
  }
}, { timestamps: true })

module.exports = model('Department', departmentSchema)
