const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
	
	const userBD = req.header('x-token')
				 ? await User.findOne({ tokenAuth: req.header('x-token') })
				 : await User.findOne({ tokenURL: req.params.token });

	try {
		
		const token = req.header('x-token') ? userBD.tokenAuth : userBD.tokenURL;

		// Verifica si el token esta vencido
		jwt.verify(token, process.env.SEED);
		req.tokenExpired = true;
		next();

	} catch {
		
		req.tokenExpired = false;
		next();
	}
}

module.exports.auth = async (req, res, next) => {
	
	if (!req.tokenExpired) {
		
		return res.status(404).json({
			ok: false,
			isExpiredToken: true,
			messages: ['El token ya a expirado'],
		});
	}

	next();
}