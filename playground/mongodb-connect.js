const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Error connecting to mongo database');
    }
    console.log('Connected to Database');
    const db = client.db('TodoApp');
    /* db.collection('Todos').insertOne({
        text: 'Something to do.',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Error inserting document', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    }); */

    db.collection('Users').insertMany([{
        name: 'Gaurav',
        age: '23',
        location: 'jaipur'
    },{
        name: 'Rohit',
        age: '23',
        location: 'jaipur'
    },{
        name: 'Rohit',
        age: '23',
        location: 'jaipur'
    },{
        name: 'Nikhil',
        age: '23',
        location: 'jaipur'
    }], (err, result) => {
        if (err) {
            return console.log('Error inserting document', err);
        }
        console.log(JSON.stringify(result, undefined, 2));
    })
    client.close();
});