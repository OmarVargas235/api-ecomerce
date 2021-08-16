const Message = require('../../models/message');
const User = require('../../models/user');

module.exports.saveMessage = async (payload) => {

	try {
		
		const message = new Message( payload );

		await message.save();

		return message;

	} catch(err) {

		console.log("saveMessage", err);
		return false;
	}
}

module.exports.viewMessage = async (payload) => {

	try {
		
		const { id, indexChat, text } = payload;
		const userBD = await User.findById(id);
		const recordsChat = userBD.recordsChat;
		
		recordsChat[indexChat].viewMessage = text === 'Marcar como no leido';
		userBD.recordsChat = recordsChat;

		await User.findByIdAndUpdate(id, userBD, false);
		
		return recordsChat;

	} catch(err) {

		console.log("saveMessage", err);
		return ['A ocurrido un error'];
	}
}