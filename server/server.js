const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const mongoose = require('../DB/mongoose');
const {Todo} = require('../DB/models/todos');

const app = express();
const PORT = process.env.port || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var newTodo = new Todo({text: req.body.text});
    newTodo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => res.status(400).send('Bad Request'));
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
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
            return res.status(404).send({});
        }
        res.send({todo});
    }).catch(e => res.status(500).send());
})

app.listen(3000, (err) => {
    if(err){
        return console.log(`Error Starting Server at port ${PORT}`);
    }
    console.log(`Service has been started at port ${PORT}`);
});

module.exports = {app};