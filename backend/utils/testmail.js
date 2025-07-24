require('dotenv').config();
const sendEmail = require('./mailer'); // adjust path as needed

(async () => {
  try {
    await sendEmail('vyshnavs5484@gmail.com', 'Test Email', 'Hello, this is a test!');
    console.log('Test email sent successfully');
  } catch (err) {
    console.error('Failed to send email:', err);
  }
})();
