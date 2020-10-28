module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  const { orgId } = req.body

  if (req.user.orgId !== orgId) {
    return res.status(400).json({ error: "У Вас нету прав для изменения данных пользователя с другой организации!" })
  }

  next()
}
