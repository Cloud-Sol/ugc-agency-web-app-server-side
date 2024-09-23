// =======================================  Importing Libraries  ================================================
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateOTP, ErrorHandler } = require('../helpers/utils');
const jwt = require('jsonwebtoken');
const { VerificationToken } = require('../models/verificationToken');
const { sendAccountVerificationEmail, sendResetOTPEmail, sendOfferEmail } = require('../email/mails');
const { TryCatch } = require('../middleware/error');
const { Offer } = require('../models/offer');
const { sendNotification } = require('../services/firebaseService');
const { Chat } = require('../models/chat');
const { Contract } = require('../models/contract');

// --------------------------- Get All Tenants

const getAll = async (req, res) => {
    try {
        const result = await User.find({ isDeleted: false });

        if (!result || result?.length == 0) {
            return res.status(404).json({ success: false, message: 'Record not Found' });
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Something went wrong!', error: err });
    }
};

// --------------------------- Get All Business Owner Offers

const getAllBusinessOwnerOffer = TryCatch(async (req, res, next) => {
    const offers = await Offer.find({ businessOwner: req?.params?.id }).populate('creator', 'firstName lastName avatar');

    if (!offers || offers?.length == 0) {
        return next(new ErrorHandler('No Offers found', 404));
    }

    return res.status(200).json(offers);
});

// --------------------------- Get All Creator Offers

const getAllCreatorOffer = TryCatch(async (req, res, next) => {
    const offers = await Offer.find({ creator: req?.params?.id }).populate('businessOwner', 'firstName lastName avatar');

    if (!offers || offers?.length == 0) {
        return next(new ErrorHandler('No Offers found', 404));
    }

    return res.status(200).json(offers);
});

// --------------------------- Create User

const createOffer = TryCatch(async (req, res, next) => {
    let { businessOwner, creator, description, amount } = req?.body;

    const bo = await User.findOne({ _id: businessOwner, isDeleted: false });
    const ctr = await User.findOne({ _id: creator, isDeleted: false });
    if (!bo || bo?.role !== 'business-owner') {
        return next(new ErrorHandler('Invalid Buiness Owner Id', 400));
    }
    if (!ctr) {
        return next(new ErrorHandler('Invalid Creator Id', 400));
    }

    const insertOffer = new Offer({
        businessOwner,
        creator,
        description,
        amount
    });

    const newOffer = await insertOffer.save();
    if (newOffer) {
        ctr?.mobileFcmToken &&
            (await sendNotification(ctr?.mobileFcmToken, `New Offer`, `You have received a new offer from ${bo?.firstName}.`));
        sendOfferEmail(newOffer, bo, ctr);
        return res.status(201).json({ success: true, message: 'Offer has been sended!' });
    }
});

// --------------------------- Update Status of Offer

const rejectOrAcceptOffer = TryCatch(async (req, res, next) => {
    let { status, rejectionReason } = req?.body;

    const offer = await Offer.findById(req?.params?.id)
        .populate('businessOwner', 'mobileFcmToken webFcmToken')
        .populate('creator', 'firstName lastName');
    if (!offer) return next(new ErrorHandler('Offer not found', 400));

    offer.status = status;
    offer.rejectionReason = rejectionReason || null;
    const updatedOffer = await offer.save();

    //---------------> Contract and chat will be created after acceptance of offer.
    let { businessOwner, creator } = offer;
    if (updatedOffer?.status == 'accepted') {
        const insertChat = new Chat({
            members: [businessOwner?._id, creator?._id]
        });
        const insertContract = new Contract({
            businessOwner: businessOwner?._id,
            creator: creator?._id,
            offer: offer?._id
        });

        await insertChat.save();
        await insertContract.save();
    }

    if (updatedOffer) {
        ctr?.mobileFcmToken &&
            (await sendNotification(
                businessOwner?.mobileFcmToken,
                `Offer ${status}`,
                `${creator?.firstName} ${creator?.lastName} has ${status} your offer.`
            ));
        res.status(200).json({ success: true, message: `Offer ${status}`, offer: updatedOffer });
    }
});

module.exports = {
    createOffer,
    rejectOrAcceptOffer,
    getAllBusinessOwnerOffer,
    getAllCreatorOffer
};
