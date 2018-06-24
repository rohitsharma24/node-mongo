const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
Mongoose.Promise = global.Promise;

Mongoose.connect('mongodb://localhost:27017/TodoApp');
/* var Todo = Mongoose.model('Todo', new Schema({
    text: String,
    completed: Boolean,
    completedAt: Number
}));
Todo.create({text: 'Cook Food'}).then(docs => console.log('saved data', docs)).catch(e => console.log(e)); */
/* const newtodo = new Todo({text: 'Cook Food'});
newtodo.save().then(docs => console.log('saved data', docs)).catch(e => console.log(e)); */

var User = Mongoose.model('User', new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
}));
const newUser = new User({email: ' rohit '});
newUser.save().then(res => console.log(res)).catch(e => console.log(e));