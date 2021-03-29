var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edern.trash@gmail.com',
    pass: 'Admin!123'
  }
});

var mailOptions = {
  from: 'edern.trash@gmail.com',
  to: 'edern.annic@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

module.exports = nodemailer;