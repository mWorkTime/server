const { Schema, model } = require('mongoose')

const reportSchema = new Schema({
  start: { type: String, required: true },
  finish: { type: String, required: true },
  total_time: { type: Number, required: true },
  break_time: { type: Number, required: true },
  description: { type: String, required: true },
  report_files: Array
})

module.exports = model('Report', reportSchema)
