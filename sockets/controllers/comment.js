const Comment = require('../../models/commentProduct');
const Product = require('../../models/product');
const { auth } = require('../auth');

// =====================================
// Agregar comentario al producto
// =====================================
module.exports.addComment = async data => {
	
	const { token, ...body } = data;
	const productBD = await Product.findById(data.idProduct);

	if (!productBD) return {
		ok: false,
		messages: ['Este producto a sido eliminado'],
	}

	const expiredToken = auth(token);

	if (expiredToken) return {
		ok: false,
		messages: ['Token expirado'],
	}

	try {
		
		const comment = new Comment(body);
		await comment.save();

		return {
			ok: true,
			messages: comment,
		}

	} catch(err) {
		
		console.log(err);

		return {
			ok: false,
			messages: ['A ocurrido un error'],
		}
	}
}

// =====================================
// Obtener comentarios del producto
// =====================================
module.exports.getComments = async id => {

	try {
		
		const comments = await Comment.find({ idProduct: id }, {__v:0}).sort({ date: -1 });

		return {
			ok: true,
			messages: comments,
		}

	} catch(err) {
		
		console.log("getComments", err);

		return {
			ok: false,
			messages: ['A ocurrido un error'],
		}
	}
}

// =====================================
// Editar comnetario
// =====================================
module.exports.editComment = async data => {
	
	const { id, comment, idProduct } = data;

	const update = {
		date: Date.now(),
		comment
	}
		
	try {

		comment
		? await Comment.findByIdAndUpdate(id, update, false)
		: await Comment.updateMany({idUser: data.idUser}, {$set: {img: data.result} });
		
		const commnets = comment
		? await Comment.find({idProduct}, {__v:0}).sort({ date: -1 })
		: await Comment.find({idUser: data.idUser}, {__v:0}).sort({ date: -1 });

		return {
			ok: true,
			messages: commnets,
		};

	} catch(err) {

		console.log("editComment", err);

		return {
			ok: false,
			messages: ['Ah ocurrido un error'],
		};
	}
}

// =====================================
// Eliminar comnetario
// =====================================

module.exports.deleteComment = async data => {
	
	const { _id:id, idProduct } = data;
		
	try {

		await Comment.findByIdAndRemove(id);
		const commnets = await Comment.find({idProduct}, {__v:0}).sort({ date: -1 });

		return {
			ok: true,
			messages: commnets,
		};

	} catch(err) {

		console.log("deleteComment", err);

		return {
			ok: false,
			messages: ['Ah ocurrido un error'],
		};
	}
}