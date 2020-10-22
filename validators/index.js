const { resendLinkValidator } = require('./resend-link.validator')
const { registerValidator, loginValidator } = require('./auth.validator')
const { employeeRegisterValidator } = require('./employee.validator')

module.exports = {
  resendLinkValidator,
  registerValidator,
  loginValidator,
  employeeRegisterValidator
}
