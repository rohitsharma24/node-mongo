const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var User = mongoose.model('user', new Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 1
    }
}));

module.exports = {User};