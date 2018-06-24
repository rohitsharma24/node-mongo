const request = require('supertest');
const expect = require('expect');

const {app} = require('../server/server');
const {Todo} = require('../DB/models/todos');

describe('POST /todos', () => {

    beforeEach((done) => {
        Todo.remove().then(() => done());
    });

    it('should create a new todo task', (done) => {
        const text = 'This is test todo task';
        request(app)
            .post('/todo')
            .send({text})
            .expect(200)
            .expect(res => expect(res.body.text).toBe(text))
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                
                Todo.find().then((doc) => {
                    expect(doc.length).toBe(1);
                    expect(doc[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            });

    });

    it('should not create task when passed invalid data', (done) => {
        request(app)
            .post('/todo')
            .send({text: ''})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((docs) => {
                    expect(docs.length).toBe(0);
                    done();
                }).catch(e => done(e))
            });
    });
});