const nodemailer = require('nodemailer')

module.exports =  nodemailer.createTransport({
  host: 'localhost',
  port: 25,
  ignoreTLS: true,
  auth: {
    user: '',
    pass: ''
  },
})
