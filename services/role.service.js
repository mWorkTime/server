const Role = require('../models/role.model')
const User = require('../models/user.model')

/**
 * getRolesFromDB. Gets roles by code-role from DB.
 * @param {array} data
 * @param {object} res
 * @return {*}
 */
exports.getRolesFromDB = (data, res) => {
  return Role.find({ 'role-code': { $in: data } })
    .exec((err, roles) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }

      res.status(200).json({ roles })
    })
}

/**
 * getUserRoleById
 * @param {string} _id
 * @param {object} res
 * @return {*}
 */
exports.getUserRoleById = (_id, res) => {
  return User.findOne({ _id }).select('role')
    .exec((err, user) => {
      if(err) {
        res.status(500).json({ msg: err.message })
        return
      }

      res.status(200).json({ code: user.role.code })
    })
}
