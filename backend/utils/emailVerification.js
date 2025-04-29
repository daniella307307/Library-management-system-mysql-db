const nodemailer = require("nodemailer");

const sendVerificationEmail= async(user,token)=>{
    const url = "http://localhost:8000/verify-email?token=${token}";

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from:"<daniellaganza30@gmail.com>",
        to:user.email,
        subject:"Verify email",
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
}

module.exports = sendVerificationEmail;