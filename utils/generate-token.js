const jwt = require('jsonwebtoken')

exports.generateToken = (user, expiresTime) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, expiresTime)
