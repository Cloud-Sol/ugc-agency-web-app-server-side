const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    unreadMessages: { type: Number, default: 0 },
    lastMessage: { type: String, default: '' },
    lastMessageDateTime: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

exports.Chat = mongoose.model('Chat', chatSchema);
