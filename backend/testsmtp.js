var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'ElPolloLocoReset@outlook.com',
        pass: '' //TODO
    }
});

var mailOptions = {
    from: 'ElPolloLocoReset@outlook.com',
    to: 'mremley@umass.edu',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});