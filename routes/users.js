var express = require('express'),
	multer = require('multer'),
	cloudinary = require('cloudinary'),
	Comment = require('../models/comment'),
	userMiddleware = require('../middleware/user'),
	router = express.Router(),
	storage = multer.diskStorage({
		filename: function(req, file, callback) {
			callback(null, Date.now() + file.originalname);
		}
	}),
	imageFilter = function (req, file, cb) {
		// accept image files only
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
	upload = multer({
		storage: storage,
		fileFilter: imageFilter
	});

// =========================
// CLOUDINARY CONFIG
// =========================
cloudinary.config({
	cloud_name: 'thessh',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// =========================
// RESTful USERS ROUTES
// =========================
// SHOW ROUTE
router.get('/:user_id', userMiddleware.findUserById, userMiddleware.findUserAdditionalInfo, function(req, res) {
	if (!req.foundUser) {
		req.flash('error', 'The requested user could not be found.');
		res.redirect('/topics');
	} else {
		res.render('users/show', {user: req.foundUser, topics: req.topics, resources: req.resources, comments: req.comments});
	}
});

// UPDATE ROUTE
router.put('/:user_id', userMiddleware.findUserById, upload.single('uploadProfilePic'), async function(req, res) {
	var uploadedImage;
	if (!req.foundUser) {
		req.flash('error', 'Your profile cannot be updated at this time. Try again later.');
		res.redirect('/topics');
	} else {
		try {
			// delete existing profile picture if one exists
			if (req.foundUser.profilePictureId) {
				await cloudinary.v2.uploader.destroy(req.foundUser.profilePictureId);
			}
			
			// upload new profile picture
			uploadedImage = await cloudinary.v2.uploader.upload(req.file.path);
			
			// update user profile picture settings
			req.foundUser.set({
				profilePicture: uploadedImage.secure_url,
				profilePictureId: uploadedImage.public_id
			});
			
			// save user profile
			await req.foundUser.save();
			
			// update comments with new profile picture
			await Comment.updateMany({'author.id': req.foundUser._id}, {$set:{'author.profilePicture': uploadedImage.secure_url}});
			
			res.redirect('/users/' + req.foundUser._id);
		} catch (err) {
			req.flash('error', 'Your profile cannot be updated at this time. Try again later.');
			res.redirect('/topics');
		}
	}
});

module.exports = router;