const jwt = require('jsonwebtoken')

/**
 * verifyTokenFromReq. Get token from request, verify and return data from the verify
 * @param {Object} req
 * @return {{_id: *, username: *}|any}
 */
exports.verifyTokenFromReq = (req) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  return {
    _id: decodedToken._id,
    isOwner: decodedToken.isOwner,
    orgId: decodedToken.orgId,
    roles: decodedToken.roles
  }
}

/**
 * verifyToken. Get token, decoded and returned email,
 * @param {string} token
 * @return {object} {{ email: string }}
 */
exports.verifyToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  return {
    email: decodedToken.email
  }
}
