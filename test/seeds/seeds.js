const jwt = require('jsonwebtoken'); 
const {ObjectID} = require('mongodb');
const {Todo} = require('../../DB/models/todos');
const {User} = require('../../DB/models/users');

const userIdOne = new ObjectID();
const userIdTwo = new ObjectID();
const testUsers = [{
    _id: userIdOne,
    email: "rohitsh@example.com",
    password: "rohit123",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userIdOne.toHexString(), access: 'auth'}, 'abc123').toString() 
    }]
},
{
    _id: userIdTwo,
    email: "rohitsharma1@example.com",
    password: "rohit123",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userIdTwo.toHexString(), access: 'auth'}, 'abc123').toString() 
    }]
}
];

const testTodos = [{
    _id: new ObjectID(),
    text: 'First todo',
    _creator: userIdOne
    }, {
    _id: new ObjectID(),
    text: 'Second todo',
    _creator: userIdTwo
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodos);
    }).then(() => done());
};

const populateUsers = (done) => {
    const testUserOne = new User(testUsers[0]).save();
    const testUserTwo = new User(testUsers[1]).save();
    User.remove({}).then(() => {
        return Promise.all([testUserOne, testUserTwo]);    
    }).then(() => done());
};

module.exports = {testTodos, populateTodos, testUsers, populateUsers};