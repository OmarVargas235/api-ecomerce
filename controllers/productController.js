const Product = require('../models/product');
const Comment = require('../models/commentProduct');
const User = require('../models/user');
const Orders = require('../models/orders');
const ProductHome = require('../models/productsHome');
const path = require('path');
const fs = require('fs');
const { uploadsImages } = require('../helper/uploadImg');

// =====================================
// Crear producto
// =====================================

module.exports.selectImages = async (req, res, next) => {
	
	// Verificar que se hallan enviado alguna imagen
	if (!req.files) {
		
		return res.status(400).json({
			ok: false,
			messages: ['No se a seleccionado ninguna imagen'],
		});
	}
	
	const options = {
		message: ['Debe de seleccionarse menos de 6 imagenes'],
		dirUploads: '../public/uploads/products',
		createFile: 'public/uploads/products',
	}
	const files = req.files['img-product'].name
	? [ req.files['img-product'] ]
	: req.files['img-product'];

	req.images = uploadsImages(files, res, options);
	next();
}

module.exports.createProduct = async (req, res) => {

	try {
		
		const { categories, ...body } = req.body;
		
		const product = new Product(body);
		product.idUser = body.id;
		product.images = req.images;
		product.categories = categories.split(',');

		await product.save();

		return res.status(200).json({
			ok: true,
			messages: ['Producto creado correctamente'],
		});

	} catch {

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener todos los productos
// =====================================
module.exports.getAllProducts = async (req, res) => {

	try {
		
		const productsBD = await Product.find({},'name price stock description images ratingsProduct').populate('idUser', 'name lastName img');

		return res.status(200).json({
			ok: true,
			messages: productsBD,
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
// Obtener productos
// =====================================
module.exports.getProducts = async (req, res) => {

	try {
		
		const { id } = req.params;
		const productsBD = await Product.find({idUser: id});

		const products = productsBD.map(productBD => {
			
			const product = {
			    _id: productBD['_id'],
			    name: productBD.name,
			    price: productBD.price,
			    stock: productBD.stock,
			    description: productBD.description,
			    images: productBD.images,
			    ratingsProduct: productBD.ratingsProduct,
			}

			return product;
		});

		return res.status(200).json({
			ok: true,
			messages: products,
		});

	} catch(err) {
		
		console.log(err);

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

module.exports.getProduct = async (req, res) => {

	try {
		
		const { id } = req.params;
		const productBD = await Product.findById(id, 'name price stock description categories images location idUser').populate('idUser', 'name');
		
		if (!productBD) return res.status(400).json({
			ok: false,
			messages: ['Este producto no existe'],
		});

		const product = {...productBD['_doc']};
		const { idUser:user, ...rest } = product;
		rest.user = user;

		return res.status(200).json({
			ok: true,
			messages: rest,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Editar producto
// =====================================

module.exports.selectImagesEdit = async (req, res, next) => {

	const { id } = req.params;
	const productBD = await Product.findById(id);
	
	if (!req.files) return next();

	productBD.images.forEach(img => {

		const pathImage = path.resolve(__dirname, `../public/uploads/products/${img}`);
		
		// Elimina la imagen actual
		if ( fs.existsSync(pathImage) ) fs.unlinkSync(pathImage);
	});
	
	const options = {
		message: ['Debe de seleccionarse menos de 6 imagenes'],
		dirUploads: '../public/uploads/products',
		createFile: 'public/uploads/products',
	}
	const files = req.files['img-product'].name
	? [ req.files['img-product'] ]
	: req.files['img-product'];

	req.images = uploadsImages(files, res, options);
	next();
}

module.exports.editProduct = async (req, res) => {

	try {
		
		const { id } = req.params;
		const { categories, ...body } = req.body;
		const { images } = await Product.findById(id);

		const update = {
			...body,
			images: req.images ? req.images : images,
			categories: categories.split(','),
		}
		
		await Product.findByIdAndUpdate(id, update, false);
			
		return res.status(200).json({
			ok: true,
			messages: ['Se a editado el producto correctamente'],
		});

	} catch(err) {

		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Eliminar producto
// =====================================

module.exports.deleteProduct = async (req, res) => {

	try {
		
		const { id } = req.body;
		const productBD = await Product.findByIdAndRemove(id);
		const commentBD = await Comment.deleteMany({idProduct: id});

		if (!productBD) return res.status(400).json({
			ok: false,
			messages: ['Este producto no existe'],
		});

		productBD.images.forEach(img => {

			const pathImage = path.resolve(__dirname, `../public/uploads/products/${img}`);

			// Elimina la imagen actual
			if ( fs.existsSync(pathImage) ) fs.unlinkSync(pathImage);
		});
			
		return res.status(200).json({
			ok: true,
			messages: ['Se a eliminado el producto correctamente'],
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener el producto por busqueda
// =====================================

module.exports.searchProduct = async (req, res) => {
	
	try {
		
		const { search } = req.body;

		const productsBD = await Product.find({ name: {$regex: search, $options:'i' }});

		const products = productsBD.map(productBD => {
			
			const product = {
			    _id: productBD['_id'],
			    name: productBD.name,
			    price: productBD.price,
			    stock: productBD.stock,
			    description: productBD.description,
			    images: productBD.images,
			}

			return product;
		});
			
		return res.status(200).json({
			ok: true,
			messages: products,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Agregar a favoritos
// =====================================
module.exports.addFavoriteProduct = async (req, res) => {
	
	try {
		
		const { id } = req.params;
		const { idProduct } = req.body;

		const userBD = await User.findById(id);
		const productBD = await Product.findById(idProduct);

		if (!productBD) return res.status(404).json({
			ok: false,
			messages: ['Este producto a sido eliminado'],
		});

		const favoritesProducts = [...userBD.favoritesProducts,{idProduct, product:productBD}];
		userBD.favoritesProducts = favoritesProducts;
		await userBD.save();
			
		return res.status(200).json({
			ok: true,
			messages: favoritesProducts,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Eliminar de favoritos
// =====================================
module.exports.deleteFavoriteProduct = async (req, res) => {
	
	try {
		
		const { id } = req.params;
		const { idProduct } = req.body;
		const userBD = await User.findById(id);
		const arr = userBD.favoritesProducts;

		if (!userBD) return res.status(404).json({
			ok: false,
			messages: ['Este producto a sido eliminado'],
		});
		
		userBD.favoritesProducts = arr.filter(product => product.idProduct !== idProduct);
		await userBD.save();
			
		return res.status(200).json({
			ok: true,
			messages: userBD.favoritesProducts,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener productos de favoritos
// =====================================
module.exports.getFavoriteProduct = async (req, res) => {
	
	try {
		
		const { id } = req.params;
		const userBD = await User.findById(id);

		return res.status(200).json({
			ok: true,
			messages: userBD.favoritesProducts,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Agregando coordenadas al producto
// =====================================
module.exports.coordinates = async (req, res) => {
	
	try {
		
		const { id, latLng } = req.body;
		
		const productBD = await Product.findById(id);
		productBD.location = latLng.split(',');
		
		await productBD.save();

		return res.status(200).json({
			ok: true,
			messages: productBD.location,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}

// =====================================
// Obtener los productos seleccionados por categoria
// =====================================
module.exports.getProductsSelectedController = async (req, res) => {
	
	try {
		
		const { selected } = req.body;
		const productBD = await Product.find({'categories': {"$all": [selected]} },
			{__v:0, categories:0,idUser:0,location:0,ratingsProduct:0});
		
		const products = productBD.map(product => {
			
			product.img = product.images[0];

			return product;
		});

		return res.status(200).json({
			ok: true,
			messages: products,
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
// Disminuir el stock del producto por la compra del mismo
// =====================================
module.exports.buyProduct = async (req, res) => {
	
	try {
		
		const { products } = req.body;
		const { id:idUser } = req.params;

		JSON.parse(products).forEach(async product => {
			
			const { _id:id, name, price, images, cont, user } = product;

			// Crear ordenes
			const orders = new Orders({name, price, image: images[0], amount: cont, idUser});
			await orders.save();

			// Agregar las ventas del producto al usuario
			const userBD = await User.findById(user['_id']);
			userBD.sales = userBD.sales + cont;
			await userBD.save();

			// Obtener producto y disminuir su stock
			const productBD = await Product.findById(id);
			productBD.stock = productBD.stock - product.cont;
			productBD.stock = productBD.stock < 0 ? 0 : productBD.stock;
			
			await productBD.save();			
		});

		const arrProducts = JSON.parse(products).map(product => {

			product.stock = product.stock - product.cont;
			return product;
		});

		return res.status(200).json({
			ok: true,
			messages: arrProducts,
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
// Guardar productos del home (pagina principal)
// =====================================
module.exports.productsHome = async (req, res) => {
	
	try {
		
		const { product, isExists, text } = req.body;
		const getProduct = JSON.parse(product);
		const productsHomeBD = await ProductHome.find();

		if (text === 'Quitar del home') {

			const deleteProduct = productsHomeBD.find(product => product['_id']==getProduct['_id']);

			deleteProduct && await ProductHome.findByIdAndRemove(deleteProduct['_id']);

			return res.status(200).json({
				ok: deleteProduct ? true : false,
				messages: deleteProduct
				? ['El producto se elimino del home correctamente']
				: ['Este producto no esta agregado al home'],
			});
		}
		
		// Si el producto ya esta en el home no lo agrega
		if ( JSON.parse(isExists) ) return res.status(200).json({
			ok: true,
			messages: ['Este producto ya sido agregado al home'],
			isExistsBD: true,
		});
		
		// Agregar al home
		const productHome = new ProductHome(getProduct);

		await productHome.save();

		return res.status(200).json({
			ok: true,
			messages: ['El producto se a agregado al home correctamente'],
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
// Obtener todos productos del home (pagina principal)
// =====================================
module.exports.getProductsHome = async (req, res) => {
	
	try {

		const productHomeBD = await ProductHome.find({}, {__v:0,idUser:0,ratingsProduct:0,stock:0});

		return res.status(200).json({
			ok: true,
			messages: productHomeBD,
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
// Eliminar producto del home (pagina principal)
// =====================================
module.exports.deleteProductHome = async (req, res) => {
	
	try {

		const { id } = req.body;
		
		await ProductHome.findByIdAndRemove(id);

		return res.status(200).json({
			ok: true,
		});

	} catch(err) {
		
		console.log(err);
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}