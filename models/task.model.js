const { Schema, model, Types } = require('mongoose')

const taskSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  status: { type: Number, required: true, default: 0 },
  createdBy: { type: String, required: true },
  isConfirmed: { type: Boolean, default: false },
  confirmedBy: String,
  runtime: { type: Array, required: true },
  priority: { type: Number, required: true },
  user_id: { type: Types.ObjectId, ref: 'User' },
  filepath: Array,
  comments: [{ type: Object }],
  reports: [{ type: Types.ObjectId, ref: 'Report' }]
}, { timestamps: true })

module.exports = model('Task', taskSchema)
