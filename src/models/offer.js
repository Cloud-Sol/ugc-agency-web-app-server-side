const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: 'Offer' },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    rejectionReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

exports.Offer = mongoose.model('Offer', offerSchema);
