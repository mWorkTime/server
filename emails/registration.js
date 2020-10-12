module.exports = function (email, link) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Подтверждение почты',
    html: `
        <h1 style="color: #4038BD; font-size: 24px;">Добро пожаловать в приложение Work Time Manager</h1>
        <p>Вы успешно создали аккаунт с email - ${email}</p>
        <hr />
        <p>Потвердите Вашу почту перейдя по ссылке ниже:</p>
        <a href=${link} target="_blank">Подтвердить</a>
        `
  }
}
