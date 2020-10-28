const { saveNewEmployee, getEmployeesByOrgCode, getEmployeeById, saveModifiedEmployee } = require('../services/employee.service')
const { verifyTokenFromReq } = require('../utils/verify-token-from-req')

exports.getAllEmployees = (req, res) => {
  const { orgId } = verifyTokenFromReq(req)

  getEmployeesByOrgCode(orgId, res)
}

exports.getEmployee = (req, res) => {
  const userId = req.params.id

  getEmployeeById(userId, res)
}

exports.createEmployee = async (req, res) => {
  const { _id, orgId } = verifyTokenFromReq(req)
  const { roles, name, surname, email, phone, gender, department } = req.body

  await saveNewEmployee({ _id, orgId, roles, name, surname, email, phone, gender, department }, res)
}

exports.editEmployee = (req, res) => {
  saveModifiedEmployee(req.body, res)
}
