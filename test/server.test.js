const request = require('supertest');
const expect = require('expect');

const {app} = require('../server/server');
const {Todo} = require('../DB/models/todos');

beforeEach((done) => {
    const testTodos = [{
        text: 'First todo'
    }, {
        text: 'Second todo'
    }];
    Todo.remove().then(() => {
        Todo.insertMany(testTodos).then(() => done());
    });
});

describe('POST /todos', () => {
    it('should create a new todo task', (done) => {
        const text = 'This is test todo task';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => expect(res.body.text).toBe(text))
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                
                Todo.find({text}).then((doc) => {
                    expect(doc.length).toBe(1);
                    expect(doc[0].text).toBe(text);
                    done();
                }).catch(e => done(e));
            });

    });

    it('should not create task when passed invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({text: ''})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((docs) => {
                    expect(docs.length).toBe(2);
                    done();
                }).catch(e => done(e))
            });
    });
});

describe('GET /todos', () => {
    it('should return all todo task', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})