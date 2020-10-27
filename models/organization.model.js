const { model, Schema } = require('mongoose')

const organizationSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  }
}, { timestamps: true })

module.exports = model('Organization', organizationSchema)
