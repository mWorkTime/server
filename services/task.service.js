const User = require('../models/user.model')

/**
 * getUsersOrTasksById. Depending on the user's role to return either users or tasks
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.getEmployeeAndTasksById = async (data, res) => {
  const { _id, orgId } = data

  try {
    const user = await User.findOne({ _id })
    const department = user.department.name

    if (user.role.code > 0) {
      const foundUsers = await User.find({ department: { name: department }, organization: orgId })
      res.status(200).json({ tasks: user.tasks, users: foundUsers })
      return
    }

    res.status(200).json({ tasks: user?.tasks, user })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
