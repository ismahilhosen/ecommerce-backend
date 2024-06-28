const nodeMailer = require("nodemailer");
const { smtpUser, smtpPassword } = require("../Config/secret");

const transporter = nodeMailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: smtpUser,
		pass: smtpPassword,
	},
});

const emailSendWithNodeMailer = async (emailInfo) => {
	try {
        const info = await transporter.sendMail({
            from: smtpUser, // sender address
            to: emailInfo.email, // list of receivers
            subject: emailInfo.subject, // Subject line
            html: emailInfo.html, // html body
          });

          console.log("message:%s", info.response)
	} catch (error) {
        console.error("email not send")
        throw error;
    }
};

module.exports = emailSendWithNodeMailer
