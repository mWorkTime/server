const Role = require('../models/role')

exports.roles = [
  { name: 'Admin', 'role-code': 5 },
  { name: 'Moderator', 'role-code': 4 },
  { name: 'Owner', 'role-code': 3 },
  { name: 'Manager', 'role-code': 2 },
  { name: 'Employee', 'role-code': 0 }
]
/**
 * generateRoles.Gets an array of objects, generates new roles and stores them in DB
 * @param {array} arr
 */
exports.generateRoles = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const newRole = new Role({
      name: arr[i].name,
      'role-code': arr[i]['role-code']
    })

    newRole.save()
  }
}
