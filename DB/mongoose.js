const mongoose = require('mongoose');

mongoose.promise = global.promise;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';
mongoose.connect(MONGODB_URI, (err, client)=> {
    if(err) {
        console.log('Error while connecting to MongoDB Server', err);
        return {};
    }
    console.log('Successfully connected to MongoDB Server');
    

});    


module.exports = {mongoose};