require("dotenv").config();
const twilio = require("twilio");

console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_PHONE_NUMBER);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendVerificationCode = async (phoneNumber, OTP) => {
    try {
        await client.messages.create({
            body: `Tu código de verificación para LogiEvents es: ${OTP}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log("Code sent to", phoneNumber);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { sendVerificationCode };
