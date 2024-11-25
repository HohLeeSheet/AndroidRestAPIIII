const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'tiiensibo2706@gmail.com',
      pass: 'svrdmgbyktholzyw'
    }
  });

module.exports = { transporter };