const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: process.env.MAIL_USER, 
   pass: process.env.MAIL_PASS
  }
});

const sendEmail = async (to, subject, { text, html }) => {
  console.log(process.env.MAIL_USER);
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text ,// plain text fallback
    html, // rich HTML
  };

  await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;



