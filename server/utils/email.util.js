const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // 2. Define the email options
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Auth System'} <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage
    };

    // 3. Actually send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via Gmail. MessageId:', info.messageId);
  } catch (error) {
    console.error('Error sending email through Gmail:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
