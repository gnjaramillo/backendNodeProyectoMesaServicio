// https://nodemailer.com/smtp/  documentacion nodemailer



require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = {
  sendMail: async (mailOptions) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // 'false' para STARTTLS
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      let info = await transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado: %s', info.messageId);
    } catch (error) {
      console.error('Error al enviar correo electrónico:', error);
    }
  }
};
