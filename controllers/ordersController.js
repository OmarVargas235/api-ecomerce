const Orders = require('../models/orders');

// =====================================
// Obtener ordenes por id de usuario
// =====================================
module.exports.getOrdersId = async (req, res) => {
	
	try {

		const { id } = req.params;
		const ordersBD = await Orders.find({idUser: id}).sort({ 'date': -1 });

		return res.status(200).json({
			ok: true,
			messages: ordersBD.length === 0 ? 'No hay ordenes' : ordersBD,
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
// Obtener todos las ordenes
// =====================================
module.exports.getOrders = async (req, res) => {
	
	try {

		const ordersBD = await Orders.find().sort({ 'date': -1 });
		
		return res.status(200).json({
			ok: true,
			messages: ordersBD.length === 0 ? 'No hay ordenes' : ordersBD,
		});

	} catch(err) {

		console.log(err);
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}