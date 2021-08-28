const cloudinary = require('cloudinary').v2;

module.exports.saveCloudinary = async (pathImageCurrent, dataBD, nameFile, typeProp, res) => {

	try {

		const result = await cloudinary.uploader.upload(pathImageCurrent);

		if (typeProp !== 'images') {

		    dataBD[typeProp] = {url: result.url, id: result.public_id, nameFile};
		    await dataBD.save();
		    
		    return res.status(200).json({
				ok: true,
				messages: ['Imagen subida correctamente'],
			});
		}

		return result;

    } catch (error) {

    	console.log('subir imagen de perfil', error);

    	return res.status(404).json({
			ok: false,
			messages: ['AAh ocurrido un error'],
		});
    }
}

module.exports.deleteCloudinary = async id => {

	// Eliminar imagen anterior de cloudinary
	cloudinary.uploader.destroy(id);
}