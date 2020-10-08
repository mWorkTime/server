module.exports = function (email, text) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Подтверждение почты',
    text
    // html: `
    //     <h1>Добро пожаловать в приложение Work Time Manager</h1>
    //     <p>Вы успешно создали аккаунт с email - ${email}</p>
    //     <hr />
    //     <p>Потвердите Вашу почту перейдя по ссылке ниже:</p>
    //     <a href=${link}>Подтвердить</a>
    //     `
  }
}
