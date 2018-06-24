const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Error connecting to MongoDB Server');
    }
    console.log('Successfully Connected to MongoDB Server');
    var db = client.db('TodoApp');
    db.collection('Users').find({name: 'Rohit'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, err => console.log(`Error: ${err}`));
    client.close();
});