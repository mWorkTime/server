module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  const { roles } = req.user
  const result = roles.some((elem) => elem > 0)

  if (!result) {
    return res.status(400).json({ error: "У вас нету прав для совершения данной операции." })
  }
  
  next()
}
