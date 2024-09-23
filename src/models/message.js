const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who sent the message
    content: { type: String },
    mediaUrl: { type: String }, // Optional media URL
    createdAt: { type: Date, default: Date.now },
});

exports.Message = mongoose.model('Message', messageSchema);
