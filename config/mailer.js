const User = require('../models/user');
const nodemailer = require("nodemailer");
const util = require('util');

const templete = url => ( `
	<h1 style="text-align:center; font-family: Arial, Helvetica;">Reestablecer Password</h1>
	<p style="font-family: Arial, Helvetica;">Hola, has solicitado reestablecer tu password, haz click en el siguiente enlace, este enlace es temporal, si se vence es necesario que vuelvas a solicitar otro e-mail.</p>
	<a style="display:block; 
		font-family: Arial, Helvetica;
		padding: 1rem; 
		background-color: #00C897; 
		color:white; 
		text-transform:uppercase; 
		text-align:center;
		text-decoration: none;" 
		href="${url}"
		target="_blank"
	>Resetear Password</a>
	<p style="font-family: Arial, Helvetica;">Si no puedes acceder a este enlace, visita: <a target="_blank" href="${url}">Aqui</a></p>
	<p style="font-family: Arial, Helvetica;">Si no solicitaste este e-mail, puedes ignorarlo</p>
`);

const templeteConfirmEmail = url => ( `
	<h1 style="text-align:center; font-family: Arial, Helvetica;">Confirmar cuenta</h1>
	<p style="font-family: Arial, Helvetica;">Confirma tu cuenta haciendo click en el boton.</p>
	<a style="display:block;
		font-family: Arial, Helvetica;
		padding: 1rem;
		background-color: #00C897;
		color:white;
		text-transform:uppercase;
		text-align:center;
		text-decoration: none;"
		target="_blank"
		href="${url}"
	>Confirmar cuenta</a>
`);

const transport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: 'omarpruebas0@gmail.com',
		pass: process.env.MAILER,
	},
});

exports.sendEmail = options => {

	const optionsEmail = {
		from: 'ecomerce <noreply@ecomerce.com',
		to: options.email,
		subject: options.subject,
		html: options.changePassword ? templete(options.resetUrl) : templeteConfirmEmail(options.resetUrl),
	}

	transport.sendMail(optionsEmail, async function(err, data) {

		if (err) {
			
			console.log(err);
			const { idUserBD } = options;
			await User.findByIdAndRemove(idUserBD);
		}
	});
}