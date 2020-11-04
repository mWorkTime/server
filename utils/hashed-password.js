const crypto = require('crypto')

exports.hashedPassword = (password, salt) => {
  return crypto
          .createHmac('sha1', salt)
          .update(password)
          .digest('hex')
}
