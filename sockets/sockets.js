const { auth } = require('./auth');
const {
	editCoordinates,
	qualificationProduct,
	getQualificationProduct,
	getStockProduct,
} = require('./controllers/product');
const {
	addComment,
	getComments,
	editComment,
	deleteComment,
} = require('./controllers/comment');
const {
	userConnected,
	userDisConnected,
	getUsersConnected,
} = require('./controllers/user');
const { saveMessage, viewMessage } = require('./controllers/message');
const { saveNotifications } = require('./controllers/notifications');

class Sockets {

	constructor( io ) {

		this.io = io;
		this.socketsEventos();
	}

	socketsEventos() {
	
		this.io.on('connection', client => {
			
			console.log('Cliente conectado');
					
			// Usuario conectado
			client.on('connect-user', id => {

				if (!id) return;

				userConnected(id);
				client.join( id );

				setTimeout(async () => {

					this.io.emit('get-users-connected', await getUsersConnected());
				}, 100);
			});
			
			// Usuario desconectado
			client.on('disconnect-user', async id => {

				if (!id) return;
				
				await userDisConnected(id);
				this.io.emit('get-users-connected', await getUsersConnected());
			});

			// Obtener usuarios conectados
			client.on('get-users-connected', async (data, callback) => {

				this.io.emit('get-users-connected', await getUsersConnected());
			});

			client.on('join-chat-room', id => client.join( id ));

			// Editar coordenadas del producto
			client.on('edit-coordinates', async ({ coordinates, id }) => {
				
				const product = await editCoordinates(coordinates, id);
				client.broadcast.to(id).emit('get-coordinates', product);
			});

			// Modificar el stock del produto en todas las vistas
			client.on('stock-product', data => {

				this.io.emit('get-stock-product', data);
			});
			
			// Calificar el producto
			client.on('qualification-product', async (data, callback) => {
				
				const { ok, messages, ratingsProduct } = await qualificationProduct(data);
				
				client.emit('get-qualification-message', { ok, messages });

				if (!ok) return;

				this.io.to( data.idProduct ).emit('get-qualification-product', ratingsProduct);
			});

			// Obtener calificaciones del producto
			client.on('get-qualification-product', async (id, callback) => {
				
				const ratingsProduct = await getQualificationProduct(id);
				callback(ratingsProduct);
			});

			// Agregar comentario al producto
			client.on('add-comment', async data => {
				
				const comment = await addComment(data);	
				this.io.to(data.idProduct).emit('get-comment', comment);
			});
			
			// Obtener los comentarios del producto
			client.on('get-comments', async (id, callback) => {
				
				const getComment = await getComments(id);
				callback(getComment);
			});

			// Editar comentario
			client.on('edit-comment', async data => {
				
				const resp = await editComment(data);
				this.io.to(data.idProduct).emit('get-comments-edit-delete', resp);
			});

			// Eliminar comentario
			client.on('delete-comment', async data => {

				const resp = await deleteComment(data);
				this.io.to(data.idProduct).emit('get-comments-edit-delete', resp);
			});

			// Escuchar cuando el cliente manda un mensaje
            client.on('message-personal', async (data, callback) => {
				
            	const isExpiredToken = await auth(data.token);
            	if (isExpiredToken) return callback(isExpiredToken);

                const message = await saveMessage(data);
                callback(message);
                
                this.io.to( data.for ).emit('get-message-personal', message);
                this.io.to( data.of ).emit('get-message-personal', message);

                this.io.to( data.for ).emit('message-personal', message);
                this.io.to( data.of ).emit('message-personal', message);
            });

            // Marcar como visto el mensaje
            client.on('view-message', async (data, callback) => {

            	const chats = await viewMessage(data);
            	callback(chats);
            });

            // Contador de notificaciones
            client.on('notifications-cont', (data) => {

            	saveNotifications(data);
            	client.to( data.for ).emit('notifications-cont', data['for']);
            });
		});
	}
}

module.exports = Sockets;