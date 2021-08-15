const jwt = require('jsonwebtoken');

const generarJWT = (payload, timeExpired="3h") => {

    return new Promise(  ( resolve, reject ) => {

        jwt.sign( payload, process.env.SEED, {
            expiresIn: timeExpired,
        }, ( err, token ) => {

            err
            ? reject('No se pudo generar el JWT')
            : resolve( token );
        });
    });  
}

module.exports = {
    generarJWT,
}