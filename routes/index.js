const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const resetPasswordController = require('../controllers/resetPasswordController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const messageController = require('../controllers/messageController');
const ordersController = require('../controllers/ordersController');
const { validateEditUser } = require('../middleware/validateEditUser');
const { 
	validateFormRegister,
	validateFormLogin,
	validateFormSendChangePassword,
	validateFormChangePassword,
	validateSearch,
} = require('../middleware/validations');
const {
	validateProduct,
	validateNumber,
} = require('../middleware/validationsProduct');
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

	// Obtener usuario
	router.get('/get-user',
		verifyToken,
		auth,
		userController.getUser,
	);

	// Obtener usuario por id
	router.get('/get-user/:id',
		userController.getUserId,
	);

	// Editar perfil
	router.post('/edit-user',
		verifyToken,
		auth,
		validateEditUser,
		userController.editUser,
	);

	// Subir imagen de usuario
	router.post('/upload-img',
		verifyToken,
		auth,
		userController.uploadImg,
	);

	// Obtener las notificaciones del usuario
	router.get('/get-notifications/:id',
		verifyToken,
		auth,
		userController.getNotifications,
	);

	// Marcar como visto la notificacion
	router.post('/view-notification/:id',
		verifyToken,
		auth,
		userController.viewNotifications,
	);

	// Eliminar todas las notificaciones
	router.delete('/delete-notifications/:id',
		verifyToken,
		auth,
		userController.deleteNotifications,
	);

	// Obtener todos los usuarios
	router.get('/get-users',
		userController.getUsers,
	);

	// Cambiar el rol del usuario
	router.put('/change-rol-user',
		verifyToken,
		auth,
		userController.changeRolUser,
	);
	
	// Crear producto
	router.post('/create-product',
		verifyToken,
		auth,
		validateProduct,
		validateNumber,
		productController.selectImages,
		productController.createProduct,
	);

	// Editar producto
	router.post('/edit-product/:id',
		verifyToken,
		auth,
		validateProduct,
		validateNumber,
		productController.selectImagesEdit,
		productController.editProduct,
	);
	
	// Eliminar producto
	router.delete('/delete-product',
		verifyToken,
		auth,
		productController.deleteProduct,
	);
	
	// Obtener todos los productos
	router.get('/get-all-products',
		productController.getAllProducts,
	);

	// Obtener todos los productos del usuario
	router.get('/get-products/:id',
		productController.getProducts,
	);

	// Obtener producto
	router.get('/get-product/:id',
		productController.getProduct,
	);
	
	// Obtener producto por busqueda
	router.post('/search-product',
		validateSearch,
		productController.searchProduct,
	);

	// Agregar a favoritos
	router.post('/add-favorite-product/:id',
		verifyToken,
		auth,
		productController.addFavoriteProduct,
	);
	
	// Eliminar de favoritos
	router.delete('/delete-favorite-product/:id',
		verifyToken,
		auth,
		productController.deleteFavoriteProduct,
	);

	// Obtener productos de favoritos
	router.get('/get-favorite-product/:id',
		verifyToken,
		auth,
		productController.getFavoriteProduct,
	);

	// Guardar coordenadas del producto
	router.post('/save-coordinates',
		productController.coordinates,
	);

	// Obtener los productos seleccionados por categoria
	router.post('/get-products-category',
		productController.getProductsSelectedController,
	);

	// Disminuir el stock del producto por la compra del mismo
	router.post('/buy-product/:id',
		verifyToken,
		auth,
		productController.buyProduct,
	);

	// Guardar productos del home (pagina principal)
	router.post('/products-home',
		verifyToken,
		auth,
		productController.productsHome,
	);

	// Obtener todos productos del home (pagina principal)
	router.get('/get-products-home',
		productController.getProductsHome,
	);

	// Eliminar producto del home (pagina principal)
	router.delete('/delete-product-home',
		productController.deleteProductHome,
	);

	// Obtener mensajes
	router.get('/get-messages/:id',
		messageController.getMessage,
	);

	// Obtener historial de chat de un usuario en concreto
	router.get('/get-record-users/:id',
		verifyToken,
		auth,
		messageController.getRecordMessage,
	);

	// Guardar el historial del chat
	router.post('/records-chat/:id',
		messageController.saveRecordsChat,
	);

	// Bloquear usuario
	router.post('/users-blocked/:id',
		verifyToken,
		auth,
		messageController.usersBlocked,
	);

	// Obtener usuarios bloqueados
	router.get('/get-idBlockeds/:id',
		verifyToken,
		auth,
		messageController.getUsersBlocked,
	);

	// Eliminar chat del historial de chats
	router.delete('/delete-chat/:id',
		verifyToken,
		auth,
		messageController.deleteChat,
	);

	// Guardar imagenes en el mensaje del chat
	router.post('/upload-images',
		verifyToken,
		auth,
		messageController.uploadImagesChat,
	);

	// Obtener las imagenes del mensaje del chat
	router.get('/get-images/:id',
		messageController.getImagesChat,
	);

	// Obtener ordenes por id de usuario
	router.get('/get-orders/:id',
		verifyToken,
		auth,
		ordersController.getOrdersId,
	);

	// Obtener ordenes por id de usuario
	router.get('/get-orders',
		verifyToken,
		auth,
		ordersController.getOrders,
	);

	return router;
}