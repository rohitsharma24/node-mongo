const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Error connecting MongoDb Server');
    }
    console.log('Successfully connected to MongoDB server');
    var db = client.db('TodoApp');
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b2279f45d57f348ad73904d')}).then(result => {
        console.log(JSON.stringify(result, undefined, 2));
    });

    client.close();
});