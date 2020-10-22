const { model, Schema } = require('mongoose')

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 32
  },
  'code-department': {
    type: String,
    required: true,
    max: 8,
    index: true
  }
}, { timestamps: true })

module.exports = model('Department', departmentSchema)
