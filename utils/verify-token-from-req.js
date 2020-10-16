const jwt = require('jsonwebtoken')

/**
 * verifyTokenFromReq. Get token from request, verify and return data from the verify
 * @param {Object} req
 * @param {Object} res
 * @return {{_id: *, username: *}|any}
 */
exports.verifyTokenFromReq = (req, res) => {
  const token = req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(400).json({ error: 'token not found' })
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  return {
    _id: decodedToken._id,
    username: decodedToken.username,
    isOwner: decodedToken.isOwner,
    orgCode: decodedToken.orgCode
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
