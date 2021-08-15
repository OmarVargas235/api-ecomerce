const { check, validationResult } = require('express-validator');

const showErrorsMessage = async (req, res, next) => {

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

const validateEditUser = [
    check('name', 'El nombre es obligatorio').trim().not().isEmpty().escape(),
    check('lastName', 'El apellido es obligatorio').trim().not().isEmpty().escape(),
    check('name', 'El nombre debe de ser de menos de 8 caracteres').isLength({ max: 8 }),
    check('lastName', 'El apellido debe de ser de menos de 10 caracteres').isLength({ max: 10 }),
    showErrorsMessage,
];

module.exports = {
	validateEditUser,
}