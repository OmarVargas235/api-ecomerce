const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const notificationsSchema = new Schema({
	of: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    for: {
        type: Schema.Types.ObjectId,
        ref: 'user',
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
    url: { 
        type: String,
        default: '',
    },
    img: String,
});

notificationsSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = mongoose.model('notifications', notificationsSchema);