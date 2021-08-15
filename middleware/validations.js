const { check, body, validationResult } = require('express-validator');

const showErrorsMessage = async (req, res, next) => {
	
	(req.route.path === '/create-user' || req.route.path === '/reset-password/:token') && await check('repeatPassword', 'El password es diferente').equals(req.body.password).run(req)

	const mistake = validationResult(req);

	if (mistake.errors.length > 0) {
		
		const messageError = mistake.errors.map(error => error.msg);

		res.status(404).json({
			ok: false,
			messages: messageError,
		});

		return;
	}	
	
	next();
}

const validateFormRegister = [
    body('name', 'El nombre es obligatorio').not().isEmpty().escape(),
    body('lastName', 'El apellido es obligatorio').not().isEmpty().escape(),
    body('email', 'El email es obligatorio').isEmail().normalizeEmail().escape(),
    body('password', "El password es requerido").notEmpty().escape(),
    check('password', 'El password debe de ser de mas de 3 caracteres').isLength({ min: 3 }),
    check('name', 'El nombre debe de ser de menos de 8 caracteres').isLength({ max: 8 }),
    check('lastName','El apellido debe de ser de menos de 10 caracteres').isLength({max: 10}),
    showErrorsMessage,
];

const validateFormLogin = [
    body('email', 'El email es obligatorio').isEmail().normalizeEmail().escape(),
    body('password', "El password es requerido").notEmpty().escape(),
    showErrorsMessage,
];

const validateFormSendChangePassword  = [
    body('email', 'El email es obligatorio').isEmail().normalizeEmail().escape(),
    showErrorsMessage,
];

const validateFormChangePassword = [
    body('password', "El password es requerido").notEmpty().escape(),
    check('password', 'El password debe de ser de mas de 3 caracteres').isLength({ min: 3 }),
    showErrorsMessage,
];

const validateSearch = [
    body('search', "El campo esta vacio").notEmpty().escape(),
    showErrorsMessage,
];

module.exports = {
	validateFormRegister,
	validateFormLogin,
	validateFormSendChangePassword,
	validateFormChangePassword,
	validateSearch,
}