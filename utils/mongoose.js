const mongoose = require('mongoose');
module.exports = {
	init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		};
		mongoose.connect(process.env.TOKENMONGO, dbOptions);
		mongoose.set('useFindAndModify', false);
		mongoose.Promise = global.Promise;
		mongoose.connection.on('err', (err) => {
			console.error(`Mongoose connection error: \n${err.stack}`);
		});
		mongoose.connection.on('disconnected', () => {
			console.warn('Mongoose connection lost');
		});
	},
};
