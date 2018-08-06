const mongoose = require('mongoose');

// mongoose.promise = global.promise;
mongoose.connect(process.env.MONGODB_URI, (err, client)=> {
    if(err) {
        return err;    
    }
    console.log('Successfully connected to MongoDB Server');
}).catch(e => console.log('Error while connecting to MongoDB Server', e));    


module.exports = {mongoose};