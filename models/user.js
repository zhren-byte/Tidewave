const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: Number,
	userName: String,
	warns: [
		{
			_id: Number,
			warn: Number,
		},
	],
});

module.exports = mongoose.model('User', userSchema, 'user');
