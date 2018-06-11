var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    userSchema;

userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);