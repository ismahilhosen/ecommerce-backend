require("dotenv").config()


const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientUrl = process.env.CLIENT_URL;


module.exports = {
    smtpUser,
    smtpPassword,
    clientUrl
}