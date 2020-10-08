const jwt = require('jsonwebtoken')

/**
 * generateToken
 * @param {object} user
 * @param {object} expiresTime
 * @return {string} token
 */
exports.generateToken = (user, expiresTime) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, expiresTime)
