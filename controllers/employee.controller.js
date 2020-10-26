const { saveNewEmployee, getEmployeesByOrgCode } = require('../services/employee.service')
const { verifyTokenFromReq } = require('../utils/verify-token-from-req')

exports.getAllEmployees = (req, res) => {
  const { orgId } = verifyTokenFromReq(req)

  getEmployeesByOrgCode(orgId, res)
}

exports.createEmployee = async (req, res) => {
  const { _id, orgId } = verifyTokenFromReq(req)
  const { roles, name, surname, email, phone, gender, department } = req.body

  await saveNewEmployee({ _id, orgId, roles, name, surname, email, phone, gender, department }, res)
}
