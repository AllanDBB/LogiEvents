const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MediaSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'audio'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

MediaSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Media', MediaSchema);