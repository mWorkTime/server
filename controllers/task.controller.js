const { getEmployeesAndTasksById } = require('../services/task.service')

exports.getEmployeesAndTasks = async (req, res) => {
  const { _id, orgId } = req.user

  await getEmployeesAndTasksById({ _id, orgId }, res)
}
