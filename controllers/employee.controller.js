const { saveNewEmployee } = require('../services/employee.service')
const { verifyTokenFromReq } = require('../utils/verify-token-from-req')

exports.getAllEmployees = (req, res) => {

}

exports.createEmployee = async (req, res) => {
  const { _id, orgCode } = verifyTokenFromReq(req, res)
  const { roles, name, surname, email, password, phone, gender, department } = req.body

  await saveNewEmployee({ _id, orgCode, roles, name, surname, email, password, phone, gender, department }, res)
}
