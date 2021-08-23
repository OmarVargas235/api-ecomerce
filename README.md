# api-ecomerce

### Descripcion:

Esta api se encarga de servir las rutas a la apliacacion del ecomerce para que esta
pueda logearse, registrarse, cambiar su contraseña entre otros.

Que cosas necesitas para correr el **Proyecto**:

* NodeJs => v12.18.3;
* NPM => v6.14.5;

### Instalación :wrench:

En el directorio del proyecto, puede ejecutar:

#### ``npm install``

Ejecuta la aplicación en modo de desarrollo.
#### ``npm run nodemon o npm start``
Corre en el puerto _**http://localhost:5000**_.

### Estructura de carpeta

~~~
├── config
      ├── mailer.js
      ├── db.js
      ├── config.js
├── controllers
      ├── authController.js
      ├── messageController.js
      ├── ordersController.js
      ├── productController.js
      ├── resetPasswordController.js
      ├── userController.js
├── helper
      ├── jwt.js
      ├── uploadImg.js
      ├── user.js
├── middleware
      ├── validateEditUser.js
      ├── validations.js
      ├── validationsProduct.js
      ├── verifyToken.js
├── models
      ├── commentProduct.js
      ├── message.js
      ├── notifications.js
      ├── orders.js
      ├── product.js
      ├── productsHome.js
      ├── user.js
├── routes
      ├── index.js
├── sockets
      ├── controllers
            ├── comment.js
            ├── message.js
            ├── notifications.js
            ├── product.js
            ├── user.js
      ├── auth.js
      ├── sockets.js
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
~~~

### Autor [:octocat:](https://github.com/OmarVargas235)

**_Omar Vargas_**
