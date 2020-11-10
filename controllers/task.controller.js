const { getEmployeeAndTasksById } = require('../services/task.service')

exports.getEmployeeAndTasks = async (req, res) => {
  const { _id, orgId } = req.user

  await getEmployeeAndTasksById({ _id, orgId }, res)
}
