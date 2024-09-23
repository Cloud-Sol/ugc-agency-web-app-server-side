const mongoose = require('mongoose');

let mTypes = ['Content', 'UDC Ad', 'PR Video', 'Views and Ratings', 'Collaboration', 'Unboxing'];

const mediaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: '',
        required: true
    },
    mediaType: {
        type: String,
        enum: mTypes,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['video', 'image'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

exports.Media = mongoose.model('Media', mediaSchema);
