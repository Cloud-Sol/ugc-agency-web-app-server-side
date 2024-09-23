const express = require('express');
const router = express.Router();

const mediaController = require('../controllers/mediaController');
const { upload } = require('../middleware/cloudinaryMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const { uploadMedia, getMediaByUser, deleteMedia } = mediaController;

router.use(authMiddleware)
router.get('/user/:userId', getMediaByUser);
router.post('/upload', upload.single('file'), uploadMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
