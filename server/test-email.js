require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'hemanthemperor71@gmail.com', // sending to self for test
  from: process.env.FROM_EMAIL,
  subject: 'Test Email',
  text: 'This is a test email.',
};

sgMail
  .send(msg)
  .then(() => console.log('Email sent'))
  .catch((error) => {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  });
