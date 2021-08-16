const jwt = require('jsonwebtoken');

module.exports.auth = token => {

	try {
		
		// Verifica si el token esta vencido
		jwt.verify(token, process.env.SEED);

		return false;

	} catch(err) {
		
		console.log(err);
		return true;
	}
}