const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {

	if (err) throw new err;
	else console.log('Base de datos online');
});