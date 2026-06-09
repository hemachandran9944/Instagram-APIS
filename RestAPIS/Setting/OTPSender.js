const nodemailer = require('nodemailer');
const isMailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL,
        pass:process.env.EMAILPASSWORD
    },
    ConnectionTimedout: 10000,
    greegreetingTimeout: 10000

});


isMailer.verify((error, success)=>{
    if (error) {
        console.log('Email connection Error', error);
    } else {
        console.log('Email server is ready to send message!', success);
    }
});


const InstagramRegister = async (Gmail, Name, Otp) => {
    try {
        const EmailSetting = { 
            from: `<${process.env.EMAIL}>`,
            to: Gmail,
            subject: 'Verify your - Instgram Account',
            text: `Dear ${Name},\n\n`+
                  'To activate your account and verify your email address, please use the One-Time Passowrd (OTP) provided below:\n\n'+
                  `Verification Code ${Otp}\n\n`+
                  'Note: This code is valid for the next 10 minutes only. For your account\'s security, please do not share this OTP with anyone.\n\n' +
                  'If you did not initiate this registration, no further action is required. This email was sent to verify your address' 
        };
        return await isMailer.sendMail(EmailSetting);
    } catch (error) {
        console.log('Email Sending error', error.message);
    }
}



module.exports = {InstagramRegister};