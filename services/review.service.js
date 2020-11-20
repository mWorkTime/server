const User = require('../models/user.model')
const Task = require('../models/task.model')
const ObjectId = require('mongoose').Types.ObjectId
const crypto = require('crypto')

/**
 * getAllTasksOnReviewById
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getAllTasksOnReviewById = (_id, res) => {
  return User.findOne({ _id }).select('onReview name surname ').exec((err, user) => {
    if (err) {
      res.status(500).json({ msg: err.message })
    }

    res.status(200).json({ onReview: user.onReview, user: { name: `${user.name} ${user?.surname}`, _id: user._id } })
  })
}

/**
 * getTaskAndConfirm
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.getTaskAndConfirm = async (data, res) => {
  const { userId, taskId } = data
  try {
    await User.findOneAndUpdate({ _id: userId }, { $pull: { 'onReview': { _id: new ObjectId(taskId) } } })
    const task = await Task.findOneAndUpdate({ _id: taskId }, { isConfirmed: true })

    res.status(200).json({ success: 'Задание успешно подтверждено!', id: task._id })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * saveNewReviewComment.
 * @param {object} data
 * @param {object} res
 * @return {*}
 */
exports.saveNewReviewComment = (data, res) => {
  const { comment, taskId, createdBy } = data
  const key = crypto.randomBytes(4).toString('hex')

  const newComment = {
    key, createdAt: new Date().toISOString(),
    comment, createdBy
  }

  return Task.findOneAndUpdate({ _id: taskId }, { '$push': { comments: newComment } })
    .exec((err) => {
      if (err) {
        res.status(500).json({ msg: err.message })
      }

      res.status(200).json({ success: 'Комментарий успешно добавлен. Загрузите файлы для него!',commentKey: key })
    })
}
