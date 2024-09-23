const mongoose = require('mongoose');
const baseSchema = require('./baseSchema');

const userSchema = mongoose.Schema({
    avatar: {
        type: String,
        default: 'profile-image.png'
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Already have an account on this username']
    },
    username: {
        type: String,
        required: true,
        unique: [true, 'Already have an account on this username']
    },
    passwordHash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: '',
        required: true
    },
    lastName: {
        type: String,
        default: '',
        required: true
    },
    phoneNo: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['content-creator', 'influencer', 'business-owner', 'admin'],
        default: 'content-creator'
    },
    dateOfBirth: {
        type: Date,
        default: ''
    },
    photosAllowed: {
        type: Number,
        default: 0
    },
    videosAllowed: {
        type: Number,
        default: 0
    },
    isVerifiedAccount: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    webFcmToken: {
        type: String,
        default: ''
    }, // Token for web notifications
    mobileFcmToken: {
        type: String,
        default: ''
    }, // Token for mobile notifications
    isDeleted: {
        type: Boolean,
        default: false
    }
});

// Merge base schema with specific schema
userSchema.add(baseSchema);

exports.User = mongoose.model('User', userSchema);
