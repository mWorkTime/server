const { Schema, model, Types } = require('mongoose')

const taskSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  status: { type: Number, required: true, default: 0 },
  createdBy: { type: String, required: true },
  isConfirmed: { type: Boolean, default: false },
  runtime: { type: Array, required: true },
  priority: { type: Number, required: true },
  user_id: { type: Types.ObjectId, ref: 'User' },
  filepath: Array,
  comments: [{ type: Object }],
}, { timestamps: true })

module.exports = model('Task', taskSchema)
