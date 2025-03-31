
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    ticketType: { type: String, required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    tags: [{ type: String }],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    capacity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Event', EventSchema);