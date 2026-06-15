const { text } = require('express');
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
            from: `"Instagram Support" <${process.env.EMAIL}>`, 
            to: Gmail,
            subject: 'Verify Your Instagram Account - Action Required',
            text: `Instagram Security Notification\n\n` +
                  `Dear ${Name},\n\n` +
                  `Thank you for starting your registration with Instagram. To complete your account setup and verify your email address, please use the One-Time Password (OTP) provided below:\n\n` +
                  `User Account: ${Gmail}\n` +
                  `Verification Code: ${Otp}\n\n` +
                  `Please note that this code is strictly confidential and will remain valid for the next 10 minutes only. For your security, do not share this OTP with anyone.\n\n` +
                  `If you did not initiate this request, you can safely ignore this email; no further action is required.\n\n` +
                  `Best regards,\n` +
                  `The Instagram Security Team\n\n` +
                  `Note: This is an automated transmission. Please do not reply directly to this message.`
        };
        return await isMailer.sendMail(EmailSetting);
    } catch (error) {
        console.log('Email Sending error', error.message);
    }
}



const ForgetPasswordOtp = async (Gmail, Name, Otp) => {
    try {
        const ForgetPsswordEmailMsg = {
            from: `<${process.env.EMAIL}>`,
            to: Gmail,
            subject: 'forget passowrd otp',
            text: `Dear ${Name},\n\n`+
                `To reset your password, please use the following One-Time Password (OTP): ${Otp}\n\n`+
                'Note: This code is valid for 10 minutes and should not be shared with anyone.\n\n'+
                'If you did not request a password reset, please ignore this email.\n\n'+
'Best regards,\n\n'+
'Instagram Team.'
        };
        return await isMailer.sendMail(ForgetPsswordEmailMsg);
    } catch (error) {
        console.log('ForgetPasswordOtp', error.message);
        throw error;
    }
};



module.exports = {InstagramRegister, ForgetPasswordOtp};