const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../config/mailer');
const { generarJWT } = require('../helper/jwt');

let errorsMessageClient = {};

// =====================================
// Enviar mensaje al correo electronico para el cambio de contraseña
// =====================================

module.exports.sendEmailChangePassword  = async (req, res) => {
	
	const { email } = req.params;

	try {
		
		const userBD = await User.findOne({ email });

		// Verificando que el usuario exista
		if (!userBD) return res.status(400).json({
			ok: false,
			messages: ['Este correo no existe'],
		});

		// Comprobando si la cuenta esta activada
		if (!userBD.activeAccount) {

			return res.status(404).json({
				ok: false,
				messages: ['Debe de activar su cuenta, por favor, verifique la bandeja de entrada de su correo'],
			});
		}

		// Crear token para la url del formulario
		const token = await generarJWT({ email }, '1m');

		// Guarda el token generado en la base de datos
		userBD.tokenURL = token;
		await userBD.save();

		// Enviando correo electronico de confirmacion
		const url = `http://${req.headers.host}/redirect-form/${token}`;

		sendEmail({
			email,
			subject: 'Cambiar contraseña',
			resetUrl: url,
			changePassword: true,
		});

		res.status(200).json({
			ok: true,
			messages: ['Revise la bandeja de entrada de su correo electronico'],
		});
	
	} catch (error) {
		
		res.status(500).json({
			ok: false,
			messages: ['A ocurrido un error'],
		});
	}
}

// =====================================
// Redireccionar al fourmulario para cambiar la password o al incio de sesion
// =====================================

module.exports.redirectForm = async (req, res) => {

	if (req.tokenExpired) {

		const { token } = req.params;
		res.redirect(`${process.env.FRONTEND_URL}/formulario_cambiar_contraseña/${token}`);
	
	} else {

		errorsMessageClient = { ...errorsMessageClient, tokenExpired: true };
		res.redirect(`${process.env.FRONTEND_URL}/iniciar-sesion`);
	}
}

// =====================================
// Si el token de la url del formulario de cambiar password a expirado
// =====================================
module.exports.expiredForm = async (req, res) => {

	if (req.tokenExpired) {

		res.status(200).json({
			changePassword: false,
		});
	
	} else {

		errorsMessageClient = { ...errorsMessageClient, tokenExpired: true };
		res.status(404).json({
			changePassword: true,
		});
	}
}

// =====================================
// Guardar la nueva contraseña en la base de datos
// =====================================

module.exports.resetPassword = async (req, res) => {

	const { token } = req.params;
	const { password } = req.body;
	const userBD = await User.findOne({ tokenURL: token });

	// Sobreescribir contraseña en la base de datos
	const hash = await bcrypt.hash(password, 12);
	userBD.password = hash;
	userBD.tokenURL = undefined;

	await userBD.save();

	res.status(200).json({
		ok: true,
		messages: ['Su contraseña se ah cambiado con exito'],
	});
}

// =====================================
// Mensajes del token si ya a expirado
// =====================================

module.exports.messageClient = async (req, res) => {
	
	if (Object.keys(errorsMessageClient).length === 0) {

		return res.status(200).json({
			empty: true,
		});
	}

	if (errorsMessageClient.tokenExpired) {

		errorsMessageClient = {};

		return res.status(500).json({
			empty: false,
			ok: false,
			messages: ['Esta url a expirado, porfavor, vuelva a solicitar otro cambio de contraseña'],
		});
	}
}