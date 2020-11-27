const User = require('../models/user.model')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  const { _id } = req.user

  User.findOne({ _id })
    .exec((err, user) => {
      if (err) {
        res.status(500).json({ msg: err.message })
        return
      }

      if (user.role.code === 0) {
        res.status(400).json({ error: 'У вас нету прав для совершения данной операции.' })
        return
      }
      next()
    })
}
