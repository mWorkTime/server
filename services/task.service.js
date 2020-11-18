const User = require('../models/user.model')
const Task = require('../models/task.model')
const File = require('../models/file.model')

/**
 * getUsersOrTasksById. Depending on the user's role to return either users or tasks
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.getEmployeesAndTasksById = async (data, res) => {
  const { _id, orgId } = data

  try {
    const employee = await User.findOne({ _id }).select('department role organization tasks name surname').populate('tasks')
    const department = employee.department.name
    
    if (employee.role.code > 0) {
      const foundEmployees = await User.find({ department: { name: department }, organization: orgId })
      res.status(200).json({
        tasks: employee.tasks, employees: foundEmployees,
        role: employee.role.code, name: employee.name + ' ' + employee?.surname
      })
      return
    }

    res.status(200).json({ tasks: employee?.tasks })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * getEmployees. Depending on the user's department to return either users.
 * @param {object} data
 * @param {object} res
 */
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

/**
 * saveNewTask.
 * @param {object} data
 * @param {object} res
 * @return {Promise<void>}
 */
exports.saveNewTask = async (data, res) => {
  const { name, desc, runtime, priority, userId, createdBy } = data

  try {
    const newTask = new Task({
      name, desc, runtime, priority, user_id: userId, createdBy
    })

    await User.findOneAndUpdate({ _id: userId }, { '$push': { tasks: newTask._id } }, { upsert: true })
    await newTask.save()

    res.status(200).json({ success: 'Задача успешно сохранена. Теперь Вы можете загруть файлы!', task: newTask._id })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

/**
 * saveFilesForTask. Serialize files and save them
 * @param {array} files
 * @param {string} id
 * @param {object} res
 * @return {Promise<void>}
 */
exports.saveFilesForTask = async (files, id, res) => {
  try {
    let newFiles
    let arrLinks = []

    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        newFiles = new File({
          ...files[i],
          'original-name': files[i].originalname,
          ext: files[i].mimetype,
          name: files[i].filename
        })
        arrLinks.push(files[i].path)
        newFiles.save()
      }
    } else {
      newFiles = new File({
        ...files[0],
        'original-name': files[0].originalname,
        ext: files[0].mimetype,
        name: files[0].filename
      })
      arrLinks.push(files[0].path)
      newFiles.save()
    }

    await Task.findOneAndUpdate({ _id: id }, { filepath: arrLinks })

    res.status(200).json({ success: 'Файл(ы) для задачи успешно загружен(ы)' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
