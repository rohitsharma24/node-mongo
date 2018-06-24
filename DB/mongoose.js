const mongoose = require('mongoose');

mongoose.promise = global.promise;

mongoose.connect('mongodb://localhost:27017/TodoApp', (err, client)=> {
    if(err) {
        console.log('Error while connecting to MongoDB Server', err);
        return {};
    }
    console.log('Successfully connected to MongoDB Server');

});    


module.exports = {mongoose};