require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {mongoose} = require('../DB/mongoose');
const {Todo} = require('../DB/models/todos');
const {User} = require('../DB/models/users');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    newTodo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => res.status(400).send());
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.send({todos});
    }).catch(e => res.status(500).send(e));
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(e => res.status(500).send());
})

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(e => res.status(500).send());
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(400);
    }
    let body = _.pick(req.body, ['text', 'completed']);
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed = false;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(e => res.status(500).send());
});

app.post('/users', (req, res) => {
    const reqBody = _.pick(req.body, ['email', 'password']);
    const newUser = new User(reqBody);
    newUser.save().then(() => newUser.generateAuthToken())
        .then(token => res.header('x-auth', token).send(newUser.toJSON()))
        .catch(e => res.status(400).send(e)); 
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    const reqBody = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(reqBody.email, reqBody.password).then((user) => {
        return user.generateAuthToken().then(token => res.header('x-auth', token).send(user));
    }).catch(e => res.status(400).send());
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
    }).catch(e => res.status(401).send());
});

app.listen(PORT, (err) => {
    if(err){
        return console.log(`Error Starting Server at port ${PORT}`);
    }
    console.log(`Service has been started at port ${PORT}`);
});

module.exports = {app};