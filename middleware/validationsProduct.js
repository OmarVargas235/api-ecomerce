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

const validateProduct = [
    check('name', 'El nombre del producto obligatorio').trim().not().isEmpty().escape(),
    check('name', 'El nombre del producto debe de ser de menos de 25 caracteres').isLength({ max: 25 }),
    check('price', 'El precio es obligatorio').trim().not().isEmpty().escape(),
    check('stock', 'El stock es obligatorio').trim().not().isEmpty().escape(),
    check('description', 'La descripcion es obligatoria').trim().not().isEmpty().escape(),
    check('categories', 'Debe de seleccionar al menos una categoria').not().isEmpty(),
    showErrorsMessage,
];

const validateNumber = [
    check('price', 'El precio debe de ser un numero entero').isFloat(),
    check('stock', 'El stock debe de ser un numero entero').isFloat(),
	check('price', 'El precio del producto debe de ser de menos de 10 caracteres').isLength({ max: 10 }),
    check('stock', 'El stock del producto debe de ser de menos de 15 caracteres').isLength({ max: 15 }),
    showErrorsMessage,
];

module.exports = {
	validateProduct,
	validateNumber,
}