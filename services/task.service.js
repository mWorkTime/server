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
    const employee = await User.findOne({ _id }).select('department role organization tasks')
    const department = employee.department.name

    if (employee.role.code > 0) {
      const foundEmployees = await User.find({ department: { name: department }, organization: orgId })
      res.status(200).json({
        tasks: employee.tasks, employees: foundEmployees,
        role: employee.role.code
      })
      return
    }

    res.status(200).json({ tasks: employee?.tasks })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

exports.getEmployees = (data, res) => {
  const { orgId, department } = data

  User.find({ organization: orgId, department: { name: department } })
    .exec((err, employees) => {
      if (err) {
        res.status(500).json({ msg: err.message })
        return
      }

      res.status(200).json({ employees })
    })
}
