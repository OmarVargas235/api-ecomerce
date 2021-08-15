const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const resetPasswordController = require('../controllers/resetPasswordController');
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

	return router;
}