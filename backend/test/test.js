var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

//Configure email
var mailOptions = {
    from: 'support@elpolloloco.com',
    to: `mremley@umass.edu`,
    subject: `Forgot Password Token`,
    text: `Token: Expires:`
};

//Email token to the user
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});