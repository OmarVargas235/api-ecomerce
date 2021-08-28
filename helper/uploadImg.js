const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

module.exports.uploadsImages = (files, res, options) => {
	
	// Verificar de que al menos se hallan enviado 2 imagenes
	if (files.length > 6 && options.message) {

		return res.status(400).json({
			ok: false,
			messages: options.message,
		});
	}

	const names = files.map(file => file.name.split('.')[0] );
	const extensiones = files.map(file => file.name.split('.')[1] );

	// Extensiones validas
	const extensionsValid = {'png': true, 'jpg': true, 'jpeg': true, 'webp': true};
	const isValidateExtension = extensiones.some(extension => extensionsValid[extension] === undefined);
	
	// Validar que la extension sea valida
	if ( isValidateExtension ) {

		return res.status(400).json({
			ok: false,
			messages: ['Las extensiones permitidas son ' + Object.keys(extensionsValid)],
		});
	}

	// Cambiar nombre al archivo
	const namesFiles = names.map((name, i) => `${name}-${shortid.generate()}.${extensiones[i]}`);

	// Path de la carpeta publica donde se guardan las imagenes
	const uploads = path.resolve(__dirname, options.dirUploads);
	
	// Si la carpeta de "public/upload/products" no existe la crea
	if ( !fs.existsSync(uploads) ) fs.mkdirSync(options.createFile, {recursive:true});
	
	const pathImages = files.map((file, index) => {
		
		const nameFile = namesFiles[index];
		const pathImageCurrent = `${uploads}/${nameFile}`;

		file.mv(pathImageCurrent, function(err) {

		    if (err) return res.status(500).json({
				ok: false,
				messages: [err]
			});
	  	});

	  	return {pathImage: pathImageCurrent, nameFile: namesFiles[index]};
	});

	return pathImages;
}