module.exports = function (email, link, name) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Подтверждение почты',
    html: `
     <table style="width: 100% !important;height: 100%; background: #f8f8f8;">
      <tr>
        <td style="display: block !important; clear: both !important; margin: 0 auto !important; max-width: 580px !important;">
            <!-- Message start -->
            <table style="width: 100% !important; border-collapse: collapse; ">
                <tr>
                    <td align="center" style="padding: 80px 0; background: #6c63ff; border-radius: 10px;">
                        <h1 style="
                        line-height: 1.25; font-size: 24px; 
                        margin: 0 auto !important; max-width: 90%; 
                        text-transform: uppercase; color: #fff !important">
                          Добро пожаловать в приложение Work Time Manager
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="background: white; padding: 30px 35px;">
                        <h2 style="margin-bottom: 20px; line-height: 1.25; font-size: 18px; color: #5B53E9 !important">Привет ${name}</h2>
                        <p style="font-size: 16px; font-weight: normal; margin-bottom: 20px;" >Вы успешно создали аккаунт с email - ${email}</p>
                        <p style="font-size: 16px; font-weight: normal; margin-bottom: 20px;">Потвердите Вашу почту перейдя по ссылке ниже:</p>
                        <table>
                            <tr>
                                <td align="center">
                                    <p style="font-size: 16px; font-weight: normal; margin-bottom: 20px;">
                                        <a href=${link} target="_blank" style="
                                          display: inline-block; color: #fff; background: #6c63ff; 
                                          border: 1px solid #5b53e9; font-weight: bold; 
                                          border-radius: 25px; text-decoration: none; padding: 10px 15px;
                                        ">
                                          Подтвердить
                                        </a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td style="display: block !important; clear: both !important; margin: 0 auto !important; max-width: 580px !important;">
            <!-- Message start -->
            <table style="width: 100% !important; border-collapse: collapse; ">
                <tr>
                    <td class="content footer" style="background: none;" align="center">
                        <p style="margin-bottom: 0; color: #888; text-align: center; font-size: 14px;">Sent by <a href="#">mWorkTime</a>, 1234 Yellow Brick Road, OZ, 99999</p>
                        <p><a href="mailto:" style="color: #888; text-decoration: none; font-weight: bold;">hello@company.com</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
        `
  }
}
