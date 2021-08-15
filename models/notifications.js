const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const notificationsSchema = new Schema({
	of: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    for: {
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    nameRemitter: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    view: {
        type: Boolean,
        required: true,
        default: true,
    },
    date: { 
        type: Date,
        default: Date.now
    },
    img: String,
    url: String,
});

notificationsSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = mongoose.model('notifications', notificationsSchema);