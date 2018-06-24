const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('../DB/mongoose');
const {Todo} = require('../DB/models/todos');

const app = express();


app.use(bodyParser.json());

app.post('/todo', (req, res) => {
    var newTodo = new Todo({text: req.body.text});
    newTodo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => res.status(400).send('Bad Request'));
});

const PORT = process.env.port || 3000;
app.listen(3000, (err) => {
    if(err){
        return console.log(`Error Starting Server at port ${PORT}`);
    }
    console.log(`Service has been started at port ${PORT}`);
});


module.exports = {app};