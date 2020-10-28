const Role = require('../models/role.model')
const { transformArray } = require('../utils/transform-array')

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
