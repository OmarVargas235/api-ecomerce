const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const resetPasswordController = require('../controllers/resetPasswordController');
const userController = require('../controllers/userController');
const { validateEditUser } = require('../middleware/validateEditUser');
const { 
	validateFormRegister,
	validateFormLogin,
	validateFormSendChangePassword,
	validateFormChangePassword,
} = require('../middleware/validations');
const authController = require('../controllers/authController');
const { verifyToken, auth } = require('../middleware/verifyToken');

module.exports = () => {

	// Registro de usuarios
	router.post('/create-user', validateFormRegister, userController.createUser);

	// Confirmar el email de registro
	router.get('/confirm-email/:email', userController.confirmEmail);

	// Autenticar usuario
	router.post('/login-user', validateFormLogin, authController.loginUser);

	// Cerrar sesion
	router.post('/logout-user', authController.logoutUser);

	// Banear usuario
	router.post('/ban-user', authController.banUser);

	// Enviar el email para cambiar contraseña
	router.post('/send-email-password/:email',
		validateFormSendChangePassword,
		resetPasswordController.sendEmailChangePassword
	);

	// Redireccionar al formulario para cambiar la contraseña
	router.get('/redirect-form/:token', 
		verifyToken, 
		resetPasswordController.redirectForm
	);

	// Verificar si el token del formulario de cambiar la contraseña a expirado
	router.get('/expired-form/:token',
		verifyToken,
		resetPasswordController.expiredForm,
	);

	// Cambiar la contraseña
	router.post('/reset-password/:token',
		validateFormChangePassword,
		resetPasswordController.resetPassword
	);

	// Envia el mensaje al cliente, cuando se expira el token o se activa la cuenta
	router.get('/get-message',
		userController.messageClient,
		resetPasswordController.messageClient,
	);

	// Obtener usuario
	router.get('/get-user',
		verifyToken,
		auth,
		userController.getUser,
	);

	// Obtener usuario por id
	router.get('/get-user/:id',
		userController.getUserId,
	);

	// Editar perfil
	router.post('/edit-user',
		verifyToken,
		auth,
		validateEditUser,
		userController.editUser,
	);

	// Subir imagen de usuario
	router.post('/upload-img',
		verifyToken,
		auth,
		userController.uploadImg,
	);

	// Obtener las notificaciones del usuario
	router.get('/get-notifications/:id',
		verifyToken,
		auth,
		userController.getNotifications,
	);

	// Marcar como visto la notificacion
	router.post('/view-notification/:id',
		verifyToken,
		auth,
		userController.viewNotifications,
	);

	// Eliminar todas las notificaciones
	router.delete('/delete-notifications/:id',
		verifyToken,
		auth,
		userController.deleteNotifications,
	);

	// Obtener todos los usuarios
	router.get('/get-users',
		userController.getUsers,
	);

	// Cambiar el rol del usuario
	router.put('/change-rol-user',
		verifyToken,
		auth,
		userController.changeRolUser,
	);

	return router;
}