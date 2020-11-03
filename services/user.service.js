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
  return User.findOne({ _id: id }, 'name surname phone gender').exec((err, user) => {
    if (err) {
      return res.status(500).json({ msg: err.message })
    }

    res.status(200).json({ user })
  })
}

/**
 * saveModifiedUserRegular.
 * @param {string} id
 * @param {object} data
 * @param {object} res
 * @return {*}
 */
exports.saveModifiedUserRegular = (id, data, res) => {
  const { name, surname, phone, gender } = data
  return User.findOneAndUpdate({ _id: id }, { name, surname, phone, gender }, { new: true })
    .select('name surname phone gender email role isVerified isSacked isOwner department createdAt')
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      res.status(200).json({ success: 'Данные упешно обновлены', user })
    })
}

/**
 * confirmUserPassword. Gets user password from db and check.
 * @param {string} userId
 * @param {string} password
 * @param {object} res
 * @return {*}
 */
exports.confirmUserPassword = (userId, password, res) => {
  console.log(password)
  return User.findOne({ _id: userId })
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      if (!user.authenticate(password)) {
        return res.status(400).json({ error: 'Неверный пароль!' })
      }

      res.status(200).json({ success: 'Пароль верный. Можете сменить пароль.' })
    })
}
