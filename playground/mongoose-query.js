const {mongoose} = require('../DB/mongoose');
const {User} = require('../DB/models/users');
//const {ObjectID} = require('mongodb');

/* if(!ObjectID.isValid(id)) {
    return console.log('Invalid Id');
} */
let id = '5b2d10900aac8e5913a1fca3';
User.findById(id).then((user) => {
    if(!user) {
        return console.log('No user found');
    }
    console.log(user);
}).catch(e => console.log('Invalid Id'));