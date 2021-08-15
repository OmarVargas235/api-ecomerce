const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
	validateFormRegister,
	validateFormLogin,
} = require('../middleware/validations');
const authController = require('../controllers/authController');

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

	return router;
}