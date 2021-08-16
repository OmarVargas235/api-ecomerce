const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
	name: { 
        type: String,
        trim: true,
    },
    price: { 
        type: Number,
        default: 0,
    },
    amount: { 
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now
    },
    idUser: { type: Schema.Types.ObjectId, ref: 'user' },
    image: String,
});

ordersSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = mongoose.model('orders', ordersSchema);