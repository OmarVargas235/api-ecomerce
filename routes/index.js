const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
	validateFormRegister,
} = require('../middleware/validations');

module.exports = () => {

	// Registro de usuarios
	router.post('/create-user', validateFormRegister, userController.createUser);

	// Confirmar el email de registro
	router.get('/confirm-email/:email', userController.confirmEmail);

	return router;
}