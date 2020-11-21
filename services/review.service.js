const User = require('../models/user.model')
const Task = require('../models/task.model')
const File = require('../models/file.model')
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

      res.status(200).json({ success: 'Комментарий успешно добавлен. Загрузите файлы для него!', commentKey: key })
    })
}

exports.updateReviewComment = async (files, data, res) => {
  const { commentId, taskId, id } = data

  try {
    let newFiles
    let arrLinks = []

    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        newFiles = new File({
          ...files[i],
          'original-name': files[i].originalname,
          ext: files[i].mimetype,
          name: files[i].filename
        })
        arrLinks.push(files[i].path)
        newFiles.save()
      }
    } else {
      newFiles = new File({
        ...files[0],
        'original-name': files[0].originalname,
        ext: files[0].mimetype,
        name: files[0].filename
      })
      arrLinks.push(files[0].path)
      newFiles.save()
    }

    await Task.findOneAndUpdate({ _id: taskId, comments: { $elemMatch: { key: commentId } } },
      { $set: { 'comments.$.files': arrLinks, status: 1 } })
    await User.findOneAndUpdate({ _id: id }, { $pull: { 'onReview': { _id: new ObjectId(taskId) } } })

    res.status(200).json({ success: 'Файлы успешно подкреплены к коментарию!', taskId })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
