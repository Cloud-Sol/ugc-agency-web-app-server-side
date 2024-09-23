// =======================================  Importing Libraries  ================================================
const { Media } = require('../models/media');
const { User } = require('../models/user');
const { TryCatch } = require('../middleware/error');
const { uploadFile } = require('../middleware/cloudinaryMiddleware');
const { ErrorHandler } = require('../helpers/utils');

// --------------------------- Get All Tenants

const getAll = async (req, res) => {
    try {
        const result = await Media.find({ isDeleted: false });

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Get Media by User Id

const getMediaByUser = TryCatch(async (req, res, next) => {
    const result = await Media.find({ user: req?.params?.userId });

    if (!result || result?.length == 0) {
        return next(new ErrorHandler('Media not found', 404));
    }

    res.status(200).json(result);
});

// --------------------------- Create Media

const uploadMedia = TryCatch(async (req, res, next) => {
    let { userId, title, mediaType, fileType } = req?.body;
    console.log({ userId, title, mediaType, fileType });

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler('Invalid userId', 400));
    }

    const cloudinaryResult = await uploadFile(req, res);

    // Create new Media document
    const newMedia = new Media({
        user: userId, // User ID from request body
        title,
        mediaType, // Media type from request body
        url: cloudinaryResult.secure_url, // Cloudinary URL
        fileType
    });

    

    // Save Media document to MongoDB
    await newMedia.save();
    return res.status(200).json({ success: true, message: 'Media uploaded successfully', media: newMedia });
});

// --------------------------- Delete Media

const deleteMedia = TryCatch(async (req, res, next) => {
    const mediaDelete = await Media.findByIdAndDelete(req?.params?.id);

    if (!mediaDelete) {
        return next(new ErrorHandler('Media not found', 404));
    }

    return res.status(200).json({ success: true, message: 'Media deleted successfully' });
});

module.exports = {
    getMediaByUser,
    uploadMedia,
    deleteMedia
};
