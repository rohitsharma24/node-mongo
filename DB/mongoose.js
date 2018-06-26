const mongoose = require('mongoose');

mongoose.promise = global.promise;

mongoose.connect(process.env.MONGODB_URI, (err, client)=> {
    if(err) {
        console.log('Error while connecting to MongoDB Server', err);
        return {};
    }
    console.log('Successfully connected to MongoDB Server');
});    


module.exports = {mongoose};