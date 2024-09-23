// Import Cloudinary directly
const multer = require('multer');
const { Readable } = require('stream');
const cloudinary = require('../config/cloudinaryConfig');

// Set up Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload function
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const stream = new Readable();
    stream.push(req.file.buffer);
    stream.push(null);

    return new Promise((resolve, reject) => {
        // Use cloudinary directly here
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });

        stream.pipe(uploadStream);
    });
};

// Export upload middleware and function
module.exports = { upload, uploadFile };
