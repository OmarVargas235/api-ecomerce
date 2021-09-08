const Notifications = require('../../models/notifications');
const User = require('../../models/user');

module.exports.saveNotifications = async (payload) => {

	try {
		
		const { img, ...obj } = payload;
		obj.img = img.url || '';
		
		const notifications = new Notifications( obj );

		await notifications.save();

		return true;

	} catch(err) {

		console.log("saveNotifications", err);
		return false;
	}
}