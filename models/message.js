const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const messageChatSchema = new Schema({
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
    message: String,
    nameReceptor: {
        type: String,
        required: true
    },
    nameRemitter: {
        type: String,
        required: true
    },
    isBold: {
        type: Boolean,
        required: true
    },
    isCursive: {
        type: Boolean,
        required: true
    },
    date: { 
        type: Date,
        default: Date.now
    },
    images: Array,
});

messageChatSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = mongoose.model('messageChat', messageChatSchema);