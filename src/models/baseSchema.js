const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

// Add timestamps to automatically handle `createdAt` and `updatedAt` fields
baseSchema.set('timestamps', { createdAt: 'createdAt', updatedAt: 'updatedAt' });

module.exports = baseSchema;
