const User = require('../models/user');
const Notifications = require('../models/notifications');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { sendEmail } = require('../config/mailer');
const { selectedSocialMedias } = require('../helper/user');
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
// Obtener el usuario
// =====================================
module.exports.getUser = async (req, res) => {

	try {
		
		const token = req.header('x-token');
		const userBD = await User.findOne({ tokenAuth: token }, 'socialMedias name lastName email img recordsChat sales description role');

		const user = {...userBD['_doc']};
		const { _id:uid, ...rest } = user;
		rest.uid = uid;
			
		return res.status(200).json({
			ok: true,
			messages: rest,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener el usuario por id
// =====================================
module.exports.getUserId = async (req, res) => {

	try {
		
		const { id } = req.params;

		const userBD = await User.findById(id, { __v:0,tokenAuth:0,activeAccount:0,password:0 });
		
		return res.status(200).json({
			ok: true,
			messages: userBD,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Editar perfil
// =====================================
module.exports.editUser = async (req, res) => {

	try {
		
		const { id, socialMedias, ...update } = req.body;

		update.socialMedias = socialMedias.split(',');
		update.socialMedias = selectedSocialMedias(update.socialMedias);

		const userBD = await User.findByIdAndUpdate(id, update, false);

		return res.status(200).json({
			ok: true,
			messages: ['Se a editado el perfil correctamente'],
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

module.exports.uploadImg = async (req, res) => {
	
	// Verificar que se hallan enviado alguna imagen
	if (!req.files) {
		
		return res.status(400).json({
			ok: false,
			messages: ['No se a seleccionado ninguna imagen'],
		});
	}
	
	const file = req.files['image'];
	const name = file.name.split('.')[0];
	const lengthName = file.name.split('.').length - 1;
	const extension = file.name.split('.')[lengthName];

	// Extensiones validas
	const extensionsValid = ['png', 'jpg', 'jpeg', 'webp'];
	
	// Validar que la extension sea valida
	if ( !extensionsValid.includes(extension) ) {

		return res.status(400).json({
			ok: false,
			messages: ['Las extensiones permitidas son ' + extensionsValid],
		});
	}

	// Cambiar nombre al archivo
	const nameFile = `${name}-${shortid.generate()}.${extension}`;
	const userBD = await User.findById(req.body.id);

	// Path de la carpeta publica donde se guardan las imagenes
	const uploads = path.resolve(__dirname, `../public/uploads/profile`);
	
	// Si la carpeta de "public/upload/profile" no existe la crea
	if ( !fs.existsSync(uploads) ) fs.mkdirSync('public/uploads/profile', {recursive:true});
	
	const pathImagePrev = path.resolve(__dirname, `../public/uploads/profile/${userBD.img.nameFile}`);
	const pathImageCurrent = `${uploads}/${nameFile}`;

	// Eliminar imagen anterior de cloudinary
	cloudinary.uploader.destroy(userBD.img.id);

	// Elimina la imagen anterior
	if ( fs.existsSync(pathImagePrev) ) fs.unlinkSync(pathImagePrev);

	file.mv(pathImageCurrent, async function(err) {

	    if (err) {

	      	return res.status(500).json({
				ok: false,
				messages: [err]
			});
	    }

	    try {

			const result = await cloudinary.uploader.upload(pathImageCurrent);

		    userBD.img = {url: result.url, id: result.public_id, nameFile};
		    await userBD.save();

		    return res.status(200).json({
				ok: true,
				messages: ['Imagen subida correctamente'],
			});

	    } catch (error) {

	    	console.log('subir imagen de perfil', error);

	    	return res.status(200).json({
				ok: true,
				messages: ['AAh ocurrido un error'],
			});
	    }		
  	});
}

// =====================================
// Obtener notificaciones
// =====================================
module.exports.getNotifications = async (req, res) => {

	try {
		
		const { id } = req.params;
		const userBD = await User.findById(id);

		return res.status(200).json({
			ok: true,
			messages: userBD.notifications,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Marcar como visto la notificacion
// =====================================
module.exports.viewNotifications = async (req, res) => {

	try {
		
		const { id } = req.params;
		const { notifications } = req.body;
		const userBD = await User.findById(id);

		userBD.notifications = JSON.parse(notifications);
		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: userBD.notifications,
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
// Eliminar todas las notificaciones
// =====================================
module.exports.deleteNotifications = async (req, res) => {

	try {
		
		const { id } = req.params;
		const userBD = await User.findById(id);
		const notificationsBD = await Notifications.deleteMany({ for: id });

		userBD.notifications = [];
		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: userBD.notifications,
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
// Obtener todos los usuarios
// =====================================
module.exports.getUsers = async (req, res) => {

	try {
		
		const usersBD = await User.find({}, 'description img lastName name role sales socialMedias ban');

		return res.status(200).json({
			ok: true,
			messages: usersBD,
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
// Cambiar el rol del usuario
// =====================================
module.exports.changeRolUser = async (req, res) => {

	try {
		
		const { user } = req.body;
		const update = JSON.parse(user);
		const { _id:id } = update;

		const userBD = await User.findByIdAndUpdate(id, update);

		return res.status(200).json({
			ok: true,
			messages: {
				role: update.role.split('_')[0],
				message: ['rol del usuario cambiado'],

			},
		});

	} catch(err) {
			
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}