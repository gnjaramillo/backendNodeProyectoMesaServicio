// https://nodemailer.com/smtp/  documentacion nodemailer

/* const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  module.exports = transporter 
 */


require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Usa el servicio de Gmail
    auth: {
        user: process.env.EMAIL, // Tu dirección de correo de Gmail
        pass: process.env.EMAIL_PASSWORD, // La contraseña o el App Password de Gmail
    },
});

module.exports = transporter; 



  