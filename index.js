const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

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

// habilitar bodyparser
app.use( bodyParser.urlencoded({ extend: false }) );
app.use( bodyParser.json() );

// puerto
server.listen(process.env.PORT, () => console.log('corriendo en el puerto', process.env.PORT));

app.use( cors(corsOptions) );