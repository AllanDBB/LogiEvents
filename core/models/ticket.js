const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    ticketType: {
        type: String,
        required: true
    },
    ticketStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
}, {
    timestamps: true,
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;