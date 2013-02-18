var nodemailer = require('nodemailer');
var config = require('../config/config');
var mailer;
 
mailer = function (opts, cb) {
  var mailOpts, smtpTrans;

  // nodemailer configuration
  try {
    smtpTrans = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
        user: config.email,
        pass: config.password
      }
    });
  }
  catch (err) {
    cb('Nodemailer could not create Transport', '');
    return;
  }

  // mailing options
  mailOpts = {
    from: opts.from,
    replyTo: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.body
  };

  // Send maail
  try {
    smtpTrans.sendMail(mailOpts, function (error, response) {
      //if sending fails
      if (error) {
        cb(true, error);
      }
      //Yay!! message sent
      else {
        cb(false, response.message);
      }
    });
  }
  catch (err) {
    cb('Nodemailer could not send Mail', '');
  }
};
 
module.exports = mailer;
