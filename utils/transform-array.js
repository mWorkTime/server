exports.transformArray = (arr) => {
  return arr.reduce((acc, item) => {
    acc.push({ id: item._id, name: item.name })
    return acc
  },[])
}
