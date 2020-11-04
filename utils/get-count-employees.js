/**
 * getCountEmployees.
 * @param {array} arr
 * @param {number} roleCode
 * @return {*}
 */
exports.getCountEmployees = (arr, roleCode) => {
  return arr.reduce((acc, item) => {
    if(item.role.code === roleCode) {
      acc++
    }
    return acc
  }, 0)
}
