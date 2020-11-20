const { getRolesFromDB, getUserRoleById } = require('../services/role.service')

exports.getRoles = (req, res) => {
  const { roles } = req.user

  getRolesFromDB(roles, res)
}

exports.getUserRole = (req, res) => {
  const { id } = req.params
  getUserRoleById(id, res)
}
