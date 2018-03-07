'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
async function sendOverdraftMail(userDetails){
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,//587
            secure: false, // true for 465, false for other ports
            auth: {
                user: "mukesh.dasari@opusconsulting.com", // generated ethereal user
                pass: "Iammk@911911"  // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Mukesh Dasari" <mukesh.dasari@opusconsulting.com>', // sender address
            to: `mukesh.joshi@opusconsulting.com`, // list of receivers
            subject: `User ${userDetails.name} might be interested in overdraft feature` , // Subject line
            text: `Hi Sales Team,
                    User details are :
                    Name : ${userDetails.name}
                    Account Number : ${userDetails.bankDetails[0].account}

                    Regards.`, // plain text body 
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}

exports.sendOverdraftMail = sendOverdraftMail;