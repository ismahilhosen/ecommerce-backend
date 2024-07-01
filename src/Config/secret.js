require("dotenv").config()


const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientUrl = process.env.CLIENT_URL;
const imageUpDir = process.env.UPLODE_DIR;


module.exports = {
    smtpUser,
    smtpPassword,
    clientUrl,
    imageUpDir
}