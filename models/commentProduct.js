const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

 const commentSchema = new Schema({
	comment: {
		type: String,
		required: true,
		trim: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	img: String,
	idUser: { type: Schema.Types.ObjectId, ref: 'user' },
	idProduct: { type: Schema.Types.ObjectId, ref: 'product' },
	date: { 
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('comment', commentSchema);