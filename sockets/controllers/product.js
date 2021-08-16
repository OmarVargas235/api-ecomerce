const Product = require('../../models/product');
const { auth } = require('../auth');

// =====================================
// Editar las coordenadas del producto
// =====================================
async function editCoordinates(coordinates, id) {
	
	const productBD = await Product.findById(id).populate('idUser', 'name');
	productBD.location = coordinates;

	await productBD.save();
	
	const product = {
		_id: productBD['_id'],
	    name: productBD.name,
	    price: productBD.price,
	    stock: productBD.stock,
	    description: productBD.description,
	    categories: productBD.categories,
	    images: productBD.images,
	    location: productBD.location,
	    user: productBD.idUser,
	}

	return product;
}

// =====================================
// Calificacion del producto
// =====================================
async function qualificationProduct(data) {

	const { idUser } = data;
	const { idProduct, token, ...obj } = data;
	const productBD = await Product.findById(idProduct);

	if (!productBD) return {
		ok: false,
		messages: ['Este producto a sido eliminado'],
	};

	const expiredToken = auth(token);

	if (expiredToken) return {
		ok: false,
		messages: ['Token expirado'],
	}
		
	const ratingsProduct = productBD.ratingsProduct;
	const indexQualification = ratingsProduct.findIndex(el => el.idUser === idUser);

	// Si la calificacion es diferente de -1 actualiza el producto con la nueva calificacion, si no la grega al agrega al arreglo de nuevas calificaciones
	if (indexQualification !== -1) {
		
		productBD.ratingsProduct[indexQualification] = obj;
		const update = productBD;

		await Product.findByIdAndUpdate(idProduct, update, false);

	} else {
		
		productBD.ratingsProduct.push(obj);
		await productBD.save();
	}

	return {
		ok: true,
		messages: ['Producto calificado'],
		ratingsProduct: productBD.ratingsProduct,
	}
}

// =====================================
// Obtener la calificacion del producto
// =====================================
async function getQualificationProduct(id) {

	const productBD = await Product.findById(id);

	if (!productBD) return {
		ok: false,
		messages: ['Este producto a sido eliminado'],
	};

	return productBD.ratingsProduct;
}

// =====================================
// Obtener stock del producto
// =====================================
async function getStockProduct(payload) {

	const productBD = await Product.findById(payload['_id']);
	payload.stock = productBD.stock;

	return payload;
}

module.exports = {
	editCoordinates,
	qualificationProduct,
	getQualificationProduct,
	getStockProduct,
}