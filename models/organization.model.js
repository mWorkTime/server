const { model, Schema, Types } = require('mongoose')

const organizationSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  owner: { type: Types.ObjectId, ref: 'User' },
  employees: [{ type: Object }]
}, { timestamps: true })

module.exports = model('Organization', organizationSchema)
