require("dotenv").config()


const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;


module.exports = {
    smtpUser,
    smtpPassword
}