const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM || 'logieventsofficial@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password here
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100
});

/**
 * Send email using SMTP
 * @param {Object} options - Email options
 * @param {string|Array} options.to - Recipient(s)
 * @param {string} options.subject - Subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @param {string|Array} [options.cc] - CC recipients
 * @param {string|Array} [options.bcc] - BCC recipients
 * @param {Array} [options.attachments] - Attachments
 * @returns {Promise<Object>} Email sending info
 */
async function sendEmail(options) {
  try {
    const mailOptions = {
      from: `"LogiEvents" <${process.env.EMAIL_FROM || 'logieventsofficial@gmail.com'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
      priority: options.priority || 'normal'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Test email sending on startup (optional)
transporter.verify((error) => {
  if (error) {
    console.error('Error with SMTP connection:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

module.exports = {
  sendEmail,
  transporter
};