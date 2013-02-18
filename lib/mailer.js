var nodemailer = require('nodemailer');
var mailer;
 
mailer = function (opts, cb) {
  var mailOpts, smtpTrans;

  // nodemailer configuration
  try {
    smtpTrans = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
        user: opts.config.email,
        pass: opts.config.password
      }
    });
  }
  catch (err) {
    cb('Nodemailer could not create Transport', '');
    return;
  }

  // mailing options
  mailOpts = {
    from: opts.config.from,
    replyTo: opts.config.from,
    to: opts.config.to,
    subject: opts.subject,
    html: opts.body
  };

  // Send maail
  try {
    smtpTrans.sendMail(mailOpts, function (error, response) {
      //if sending fails
      if (error) {
        cb && cb(true, error);
      }
      //Yay!! message sent
      else {
        cb && cb(null, "Email sent");
      }
    });
  }
  catch (err) {
    cb && cb('Nodemailer could not send Mail', '');
  }
};
 
module.exports = mailer;
