const Department = require('../models/department.model')

/**
 * getDepartmentsFromDB. Gets all departments from DB.
 * @param {object} res
 * @return {*}
 */
exports.getDepartmentsFromDB = (res) => {
  return Department.find({})
    .exec((err, departments) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }
      let convertingDepartments = []

      for (let i = 0; i < departments.length; i++) {
        convertingDepartments.push({ id: departments[i]._id, name: departments[i].name })
      }

      res.status(200).json({ departments: convertingDepartments })
    })
}

/**
 * saveDepartmentInDB
 * @param {string} name
 * @param {object} res
 */
exports.saveDepartmentInDB = async (name, res) => {
  try {
    const serializeName = name.toLocaleLowerCase()
    const department = await Department.findOne({ name: serializeName })

    if (department) {
      return res.status(400).json({ error: 'Такой отдел уже существует. Выберите его из списка.' })
    }

    const newDepartment = new Department({
      name: serializeName
    })

    await newDepartment.validate()
    newDepartment.save()

    res.status(200).json({ success: 'Новый отдел успешно добавлен' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
