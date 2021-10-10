const mongoose = require('mongoose');
module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        };
        mongoose.connect('mongodb+srv://heroku:potlJchO0nhMLA7s@cluster0.vs1u1.mongodb.net/oconnor?retryWrites=true&w=majority', dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err.stack}`);
        });
        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose connection lost');
        });
    }
}
