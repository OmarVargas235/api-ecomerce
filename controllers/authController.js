const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helper/jwt');

module.exports.loginUser = async (req, res, next) => {

	const { email, password } = req.body;
	
	try {

		const userBD = await User.findOne({ email });

		// Comprobando si el usuario existe
		if (userBD) {

			// Comprobando si la cuenta esta activada
			if (!userBD.activeAccount) {

				return res.status(404).json({
					ok: false,
					messages: ['Debe de activar su cuenta, por favor, verifique la bandeja de entrada de su correo'],
				});
			}

			// Validar el password
			const validatePassword = await bcrypt.compare(password, userBD.password);

			if (validatePassword) {

				if (userBD.ban) return res.status(200).json({
					ok: false,
					messages: ['Este usuario a sido baneado, por incumplimientos de las normas'],
				});
				
				// Generera token
				const token = await generarJWT({id: userBD._id, name: userBD.name, email: userBD.email, lastName: userBD.lastName});
				
				// Guarda el token generado en la base de datos
				userBD.tokenAuth = token;
				await userBD.save();

				res.status(200).json({
					ok: true,
					token,
					messages: ['Ah iniciado sesion correctamente'],
				});

			} else {

				res.status(404).json({
					ok: false,
					messages: ['La contraseña es incorrecta'],
				});
			}

		} else {

			res.status(404).json({
				ok: false,
				messages: ['Este usuario no existe'],
			});
		}

	} catch(err) {
		
		console.log('loginUser', err);

		res.status(500).json({
            ok: false,
            messages: ['A ocurrido un error']
        });
	}
}

// =====================================
// Cerrar sesion
// =====================================
module.exports.logoutUser = async (req, res) => {

	try {
		
		const { id } = req.body;

		const userBD = await User.findById(id);

		userBD.tokenAuth = '';
		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: ['Se cerrado sesion correctamente'],
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Banear usuario
// =====================================
module.exports.banUser = async (req, res) => {

	try {
		
		const { id } = req.body;

		const userBD = await User.findById(id);

		userBD.ban = userBD.ban ? false : true;
		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: userBD.ban,
		});

	} catch(err) {
		
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}