const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    status: { type: String, enum: ['ongoing', 'completed', 'canceled'], default: 'ongoing' },
    submission: {
        mediaUrl: { type: String },
        submissionDate: Date
    }
});

exports.Contract = mongoose.model('Contract', contractSchema);
