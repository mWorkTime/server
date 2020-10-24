const { getRolesFromDB } = require('../services/role.service')
const { verifyTokenFromReq } = require('../utils/verify-token-from-req')

exports.getRoles = (req, res) => {
  const { roles } = verifyTokenFromReq(req)

  getRolesFromDB(roles, res)
}
