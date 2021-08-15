require('./config/config');
require('./config/db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/');

// crear el servidor
const app = express();

// Configuracion de los cors
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
	origin: (origin, callback) => {
		console.log("origin", origin);
		// Revisar si la peticion  viene de un servidor que esta en la whiteList
		const exists = whiteList.some(dominio => dominio === origin);
		
		if (exists || !origin) {

			callback(null, true);
		
		} else {
			
			callback(new Error('No permitido por CORS'), true);
		}
	}
}

app.use( cors(corsOptions) );

// habilitar bodyparser
app.use( bodyParser.urlencoded({ extend: false }) );
app.use( bodyParser.json() );

// Rutas de la app
app.use('/', routes() );

// puerto
server.listen(process.env.PORT, () => console.log('corriendo en el puerto', process.env.PORT));