const Notifications = require('../../models/notifications');
const User = require('../../models/user');

module.exports.saveNotifications = async (payload) => {

	try {
		
		const notifications = new Notifications( payload );
		const user = await User.findOne({ _id: payload['for'] }, {__v:0});
		
		if (!user) return {
			ok: false,
			messages: ['Este producto a sido eliminado'],
		};

		user.notifications.push(notifications);
		await notifications.save();
		await user.save();

		return true;

	} catch(err) {

		console.log("saveNotifications", err);
		return false;
	}
}