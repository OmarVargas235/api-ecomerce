const User = require('../models/user');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../config/mailer');
let errorsMessageClient = {};

module.exports.createUser = async (req, res) => {
	
	const { email, password } = req.body;

	// verificar que el email no exista
    const existsEmail = await User.findOne({ email });
    
    if ( existsEmail ) {
        return res.status(400).json({
            ok: false,
            messages: ['El correo ya existe']
        });
    }

    // hash de la clave
	const userBD = new User(req.body);
	const hash = await bcrypt.hash(password, 12);
	userBD.password = hash;

	userBD.activeAccount = false;

	try {
		
		await userBD.save();

		res.status(200).json({
			ok: true,
			messages: ['Se a enviado un correo de confirmacion'],
		});

		// Enviando correo electronico de confirmacion
		const url = `http://${req.headers.host}/confirm-email/${email}`;

		sendEmail({
			email,
			subject: 'Mensaje de confirmacion de cuenta',
			resetUrl: url,
			changePassword: false,
			idUserBD: userBD['_id'],
		});
	
	} catch (error) {
		
		res.status(500).json({
			ok: false,
			messages: ['A ocurrido un error'],
		});
	}
}

// =====================================
// Confirmacion de la cuenta
// =====================================

module.exports.confirmEmail = async (req, res, next) => {

	const { email } = req.params;
	const userBD = await User.findOne({ email });

	res.redirect(`${process.env.FRONTEND_URL}/iniciar-sesion`);

	// Si no existe
	if (!userBD) {

		errorsMessageClient = { ...errorsMessageClient, accountNotExists: true };
		return next();
	}

	userBD.activeAccount = true;
	await userBD.save();

	errorsMessageClient = { ...errorsMessageClient, accountExists: true };
}

// =====================================
// Mensaje de la cuenta cuando a sido activada
// =====================================

module.exports.messageClient = async (req, res, next) => {
	
	if (Object.keys(errorsMessageClient).length === 0) return next();

	if (errorsMessageClient.accountNotExists) {

		errorsMessageClient = {};

		return res.status(500).json({
			empty: false,
			ok: false,
			messages: ['No se ah podido activar la cuenta, vuelvalo intentar'],
		});
	
	} else if (errorsMessageClient.accountExists) {

		errorsMessageClient = {};

		return res.status(500).json({
			empty: false,
			ok: true,
			messages: ['Cuenta activada'],
		});
	}
}

// =====================================
// Mensaje de la cuenta cuando a sido activada
// =====================================
module.exports.messageClient = async (req, res, next) => {
	
	if (Object.keys(errorsMessageClient).length === 0) return next();

	if (errorsMessageClient.accountNotExists) {

		errorsMessageClient = {};

		return res.status(500).json({
			empty: false,
			ok: false,
			messages: ['No se ah podido activar la cuenta, vuelvalo intentar'],
		});
	
	} else if (errorsMessageClient.accountExists) {

		errorsMessageClient = {};

		return res.status(500).json({
			empty: false,
			ok: true,
			messages: ['Cuenta activada'],
		});
	}
}