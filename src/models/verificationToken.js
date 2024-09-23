const mongoose = require('mongoose');

const verificationTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})

exports.VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);