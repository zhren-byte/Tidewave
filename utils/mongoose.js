const mongoose = require('mongoose');
module.exports = {
	init: () => {
		mongoose.connect(process.env.TOKENMONGO)
			.then(() => {
				console.error('Evento: \'Mongoose Connection Done\'');
			}, err => {
				console.error(`Mongoose connection error: \n${err.stack}`);
			});
		mongoose.Promise = global.Promise;
		mongoose.connection.on('disconnected', () => {
			console.warn('Mongoose connection lost');
		});
	},
};
