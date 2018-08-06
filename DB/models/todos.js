const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//mongoose.Promise = global.Promise;
const Todo = mongoose.model('todo', new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}));

module.exports = {Todo};