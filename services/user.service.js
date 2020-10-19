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

      const { isOwner, isVerified, name, phone, email, createdAt, _id } = user
      const userPhone = phone ? phone : ''

      res.status(200).json({
        user: { name, email, phone: userPhone, isVerified, isOwner, createdAt, id: _id },
        organization: { code: user.organization.code, name: user.organization.name }
      })
    }
  )
}
