const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
        return console.log('Error While conecting to MongoDB server');
    }
    console.log('Successfully connected to MongoDb server');

    const db = client.db('TodoApp');
    db.collection('Users').findOneAndUpdate({_id: new ObjectID('5b22992f5d31f74f7888c002')}, {
        $set: {
            name: 'Gaurav'
        },
        $inc: {
            age: 1
        }
    },
        {
            returnOriginal: false
        }
    ).then(result => {
        console.log(JSON.stringify(result));
    });
    /* db.collection('Users').updateMany({}, {$set: {
        age: 23
    }}).then(result => {
        console.log(JSON.stringify(result));
    }); */

    client.close();
});