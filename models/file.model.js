const { Schema, model } = require('mongoose')

const fileSchema = new Schema({
  'original-name': {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  ext: {
    type: String,
    required: true,
  },
  disk: {
    type: String,
    required: true,
    default: 'files'
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
}, { timestamps: true })

module.exports = model('File', fileSchema)
