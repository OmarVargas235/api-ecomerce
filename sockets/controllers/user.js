const User = require('../../models/user');

// =====================================
// Conectar usuario
// =====================================
module.exports.userConnected = async id => {
	
	try {

		const userBD = await User.findById(id);

		userBD.online = true;
		await userBD.save();
	
	} catch(err) {

		console.log("userConnected", err);
	}
}

// =====================================
// Usuario desconectado
// =====================================

module.exports.userDisConnected = async id => {
	
	try {
		
		const userBD = await User.findById(id);

		userBD.online = false;
		await userBD.save();
	
	} catch(err) {

		console.log('userDisConnected', err);
	}
}

// =====================================
// Obtener usuarios conectados
// =====================================

module.exports.getUsersConnected = async () => {
	
	try {

		const usersBD = await User.find({ online: true });
		const users = usersBD.map(user => ({name: user.name, lastName: user.lastName, online: user.online, img: user.img, id: user['_id']}));

		return users;
	
	} catch(err) {

		console.log(err);
	}
}