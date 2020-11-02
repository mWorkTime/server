const User = require('../models/user.model')

/**
 * getUserFromDB. Looking for user by id in DB and return response with data about user, organization.
 * @param {string} userId
 * @param {object} res
 * @return {*}
 */
exports.getUserFromDB = (userId, res) => {
  return User.findOne({ _id: userId }).populate('organization').exec(
    (err, user) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      if (!user) {
        return res.status(400).json({ msg: 'Пользователя не существует или он был удалён!' })
      }

      const { isOwner, isVerified, name, phone, email, createdAt, _id, isSacked, role, department } = user
      const userPhone = phone ? phone : 'Не указан'

      res.status(200).json({
        user: { name, email, phone: userPhone, isVerified, isOwner, createdAt, id: _id, isSacked, role, department },
        organization: { name: user.organization.name }
      })
    }
  )
}

/**
 * getUserData. Looking for user by id in DB and return response with data about user
 * @param {string} id
 * @param {object} res
 * @return {*}
 */
exports.getUserData = (id, res) => {
  return User.findOne({ _id: id }).exec((err, user) => {
    if (err) {
      return res.status(500).json({ msg: err.message })
    }

    res.status(200).json({ user })
  })
}
