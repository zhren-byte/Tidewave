const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: String,
	userName: String,
	warns: [
		{
			_id: String,
			warn: Number,
			lastWarn: Date,
		},
	],
});

module.exports = mongoose.model('User', userSchema, 'user');
