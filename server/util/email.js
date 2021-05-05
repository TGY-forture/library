const nodemailer = require("nodemailer");
const { emailConfig } = require('../util/variable.js')

module.exports = async function sendEmail(to, code) {
  let transporter = nodemailer.createTransport(emailConfig);
  return await transporter.sendMail({
    from: 'tgy-forture@qq.com',
    to: to,
    subject: "验证码",
    text: `您的验证码为${code},有效时间五分钟，请及时填写!`,
  }).then(() => 1).catch(() => -1);
}



