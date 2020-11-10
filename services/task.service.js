const User = require('../models/user.model')

/**
 * getUsersOrTasksById. Depending on the user's role to return either users or tasks
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.getEmployeesAndTasksById = async (data, res) => {
  const { _id, orgId } = data

  try {
    const employee = await User.findOne({ _id })
    const department = employee.department.name

    if (employee.role.code > 0) {
      const foundEmployees = await User.find({ department: { name: department }, organization: orgId })
      res.status(200).json({ tasks: employee.tasks, employees: foundEmployees })
      return
    }

    res.status(200).json({ tasks: employee?.tasks })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
