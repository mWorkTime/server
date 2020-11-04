module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  const { role } = req.user

  if (role === 0) {
    return res.status(400).json({ error: "У вас нету прав для совершения данной операции." })
  }

  next()
}
