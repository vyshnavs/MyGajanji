const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vysh07165@gmail.com',
    pass: 'zwli xnfu uhks nape'
  }
});

const sendEmail = async (to, subject, text) => {
    console.log(process.env.MAIL_USER);
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;


module.exports = sendEmail;
