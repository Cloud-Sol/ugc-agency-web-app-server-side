const express = require('express');
const router = express.Router();

const offerController = require('../controllers/offerController');
const authMiddleware = require('../middleware/authMiddleware');

const { createOffer, rejectOrAcceptOffer, getAllBusinessOwnerOffer, getAllCreatorOffer } = offerController;

router.use(authMiddleware);
router.post('/', createOffer);
router.put('/update-status/:id', rejectOrAcceptOffer);
router.get('/business-owner/:id', getAllBusinessOwnerOffer);
router.get('/creator/:id', getAllCreatorOffer);

module.exports = router;
