const User = require('../models/user.model')

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
