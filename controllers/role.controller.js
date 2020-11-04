const { getRolesFromDB } = require('../services/role.service')

exports.getRoles = (req, res) => {
  const { roles } = req.user

  getRolesFromDB(roles, res)
}
