const multer = require('multer')
const crypto = require('crypto')
const randomStr = crypto.randomBytes(2).toString('hex')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'files')
  },
  filename(req, file, cb) {
    cb(null, Date.now() + randomStr + '-' + file.originalname)
  }
})

const allowedTypes = /jpeg|jpg|png|doc|docx|pdf/

const fileFilter = (req, file, cb) => {
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('file.mimetype is invalid'))
  }
}

module.exports = multer({
  storage, fileFilter
})
