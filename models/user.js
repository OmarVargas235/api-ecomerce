const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: ['ADMIN_ROLE', 'MODERATOR_ROLE', 'USER_ROLE'],
	}, 
	online: {
		type: Boolean,
		default: false,
	},
	sales: {
		type: Number,
		default: 0,
	},
	ban: {
		type: Boolean,
		default: false,
	},
	notifications: Array,
	recordsChat: Array,
	usersBloked: [String],
	favoritesProducts: [Object],
	socialMedias: Array,
	img: String,
	activeAccount: Boolean,
	tokenAuth: String,
	tokenURL: String,
});

module.exports = mongoose.model('user', userSchema);