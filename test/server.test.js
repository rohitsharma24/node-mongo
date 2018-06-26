const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const {app} = require('../server/server');
const {Todo} = require('../DB/models/todos');

const testTodos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo'
}];

beforeEach((done) => {
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
});

describe('GET /todos:id', () => {
    it('should return todo object', (done) => {
        request(app)
            .get(`/todos/${testTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(testTodos[0].text);
            })
            .end(done);
    });
    
    it('should return blank object with 404 when valid id is passed', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return blank object with 404 when invalid id is passed', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo', (done) => {
        let id = testTodos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((docs) => {
                    expect(docs).toBe(null);
                    done();
                }).catch(err => done(err));
            })
    });
    it('should return 404 when valid id is passed', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 when invalid id is passed', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update data', (done) => {
        const text = 'This is test update';
        const id = testTodos[0]._id.toHexString();
        const reqBody = {text, completed: true};
        request(app)
            .patch(`/todos/${id}`)
            .send(reqBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo._id.toHexString()).toBe(id);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should give 404 when id not found', (done) => {
        request(app)
            .patch(`/todos/${new ObjectID()}`)
            .send({text: 'updated text', completed: true})
            .expect(404)
            .end(done);
    });

    it('should give 400 when provided invalid id', (done) => {
        request(app)
            .patch('/todos/123')
            .send({text: 'updated text', completed: true})
            .expect(400)
            .end(done);
    });
});