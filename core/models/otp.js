const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 300 }  
});

module.exports = mongoose.model("OTP", OTPSchema);
