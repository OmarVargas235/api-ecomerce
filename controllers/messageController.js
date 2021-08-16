const Message = require('../models/message');
const User = require('../models/user');
const { uploadsImages } = require('../helper/uploadImg');

// =====================================
// Obtener mensajes del chat
// =====================================
module.exports.getMessage = async (req, res) => {

	try {

		const { id:arrId } = req.params;
		const arr = arrId.split('+');
		const idUser = arr[0];
		const id = arr[1];

		const messages = await Message.find({ $or: [
			{$and: [{of: idUser}, {for: id}]},
			{$and: [{of: id}, {for: idUser}]}
		]});

		return res.status(200).json({
			ok: true,
			messages: messages,
		});

	} catch(err) {

		console.log(err);
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener historial de chat de un usuario en concreto
// =====================================
module.exports.getRecordMessage = async (req, res) => {

	try {

		const { id } = req.params;
		
		const userBD = await User.findById(id);

		return res.status(200).json({
			ok: true,
			messages: userBD.recordsChat,
		});


	} catch(err) {

		console.log(err);
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Guardar el historial de chats
// =====================================
module.exports.saveRecordsChat = async (req, res) => {

	try {
		
		const { id } = req.params;
		const recordsChat = req.body;
		const userBD = await User.findById(id);
		
		userBD.recordsChat = recordsChat;
		await userBD.save();

		return res.status(200).json({
			ok: true,
		});

	} catch(err) {
		
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Bloquear usuario
// =====================================
module.exports.usersBlocked = async (req, res) => {

	try {
		
		const { id } = req.params;
		const { idUserBlocked } = req.body;

		const userBD = await User.findById(id);
		const isIncludes = userBD.usersBloked.includes(idUserBlocked);

		if (isIncludes) {
			
			const arrDeleteId = userBD.usersBloked.filter(id => id !== idUserBlocked);
			userBD.usersBloked = arrDeleteId;

		} else userBD.usersBloked.push(idUserBlocked);

		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: userBD.usersBloked,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener usuarios bloqueados
// =====================================
module.exports.getUsersBlocked = async (req, res) => {

	try {
		
		const { id } = req.params;

		const userBD = await User.findById(id);

		return res.status(200).json({
			ok: true,
			messages: userBD.usersBloked,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Eliminar chat del historial de chats
// =====================================
module.exports.deleteChat = async (req, res) => {

	try {
		
		const { id } = req.params;
		const { deleteChat } = req.body;
		const userBD = await User.findById(id);

		userBD.recordsChat = JSON.parse(deleteChat);
		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: userBD.recordsChat,
		});

	} catch(err) {
		
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Guardar imagenes en el mensaje del chat
// =====================================
module.exports.uploadImagesChat = async (req, res) => {

	try {
		
		const { id } = req.body;
		const messageBD = await Message.findById(id);

		if (!req.files) return;

		const options = {
			dirUploads: '../public/uploads/imagesMessage',
			createFile: 'public/uploads/imagesMessage',
		}
		const files = req.files['images'].name
		? [ req.files['images'] ]
		: req.files['images'];

		messageBD.images = uploadsImages(files, res, options);
		await messageBD.save();

		return res.status(200).json({
			ok: true,
			messages: messageBD.images,
		});

	} catch(err) {
		
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Guardar imagenes en el mensaje del chat
// =====================================
module.exports.getImagesChat = (req, res) => {

	try {
		
		setTimeout(async () => {

			const { id } = req.params;
			const messageBD = await Message.findById(id);

			return res.status(200).json({
				ok: true,
				messages: messageBD,
			});

		}, 500);

	} catch(err) {
		
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}