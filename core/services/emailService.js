const nodemailer = require('nodemailer');

// Configure your SMTP options
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', 
    port: 587,                
    secure: false,            
    auth: {
        user: 'username@example.com', 
        pass: 'password'             
    }
});

/**
 * Send an email using nodemailer
 * @param {Object} options Email options object
 * @param {string} options.to Recipient address
 * @param {string} options.subject Email subject
 * @param {string} [options.text] Plain text body
 * @param {string} [options.html] HTML body
 * @returns {Promise} Resolves with info about sent email
 */
function sendEmail(options) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: '"LogiEvents" <no-reply@logievents.com>',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
}

module.exports = {
    sendEmail
};