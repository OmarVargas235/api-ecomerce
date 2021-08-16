const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const productSchema = new Schema({
	categories: {
		type: Array,
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
	},
	stock: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	images: {
		type: Array,
		required: true,
	},
	ratingsProduct: [Object],
	idUser: { type: Schema.Types.ObjectId, ref: 'user' },
	location: Array,
});

module.exports = mongoose.model('product', productSchema);