require("dotenv").config()


const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientUrl = process.env.CLIENT_URL;
const imageUpDir = process.env.UPLODE_DIR;
const jwtSecret = process.env.JWT_SECRET
const jwtResetPsswordKey = process.env.JWT_RESET_PASSWORD
const jwtRefreshTokenKey = process.env.JWT_REFRESH_TOKEN



module.exports = {
    smtpUser,
    smtpPassword,
    clientUrl,
    imageUpDir,
    jwtSecret,
    jwtResetPsswordKey,
    jwtRefreshTokenKey
}