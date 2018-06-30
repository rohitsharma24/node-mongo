const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {app} = require('../server/server');
const {Todo} = require('../DB/models/todos');
const {User} = require('../DB/models/users');
const {testTodos, populateTodos, testUsers, populateUsers} = require('./seeds/seeds');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo task', (done) => {
    const text = 'This is test todo task';
    request(app)
      .post('/todos')
      .set({'x-auth': testUsers[0].tokens[0].token})
      .send({ text })
      .expect(200)
      .expect(res => expect(res.body.text).toBe(text))
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((doc) => {
          expect(doc.length).toBe(1);
          expect(doc[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create task when passed invalid data', (done) => {
    request(app)
      .post('/todos')
      .set({'x-auth': testUsers[0].tokens[0].token})
      .send({ text: '' })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((docs) => {
          expect(docs.length).toBe(2);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should return all todo task', (done) => {
    request(app)
      .get('/todos')
      .set({'x-auth': testUsers[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos:id', () => {
  it('should return todo object', (done) => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .set({'x-auth': testUsers[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should return blank object with 404 when valid id is passed', (done) => {
    request(app)
      .get(`/todos/${new ObjectID()}`)
      .set({'x-auth': testUsers[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

  it('should return blank object with 404 when invalid id is passed', (done) => {
    request(app)
      .get('/todos/123')
      .set({'x-auth': testUsers[0].tokens[0].token})
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo', (done) => {
    const id = testTodos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set({'x-auth': testUsers[1].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id).then((docs) => {
          expect(docs).toBe(null);
          done();
        }).catch(err => done(err));
      });
  });
  it('should return 404 when valid id is passed', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set({'x-auth': testUsers[1].tokens[0].token})
      .expect(404)
      .end(done);
  });
  it('should return 404 when invalid id is passed', (done) => {
    request(app)
      .delete('/todos/123')
      .set({'x-auth': testUsers[1].tokens[0].token})
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update data', (done) => {
    const text = 'This is test update';
    const id = testTodos[0]._id.toHexString();
    const reqBody = { text, completed: true };
    request(app)
      .patch(`/todos/${id}`)
      .set({'x-auth': testUsers[0].tokens[0].token})
      .send(reqBody)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end((err, res) => {
        if (err) {
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
      .set({'x-auth': testUsers[0].tokens[0].token})
      .send({ text: 'updated text', completed: true })
      .expect(404)
      .end(done);
  });

  it('should give 400 when provided invalid id', (done) => {
    request(app)
      .patch('/todos/123')
      .set({'x-auth': testUsers[0].tokens[0].token})
      .send({ text: 'updated text', completed: true })
      .expect(400)
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    const reqBody = {email: 'testemail@example.com', password: 'testpassword'};
    request(app)
      .post('/users')
      .send(reqBody)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(reqBody.email);
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end(done);

  });
  it('should return 400, when user is already present', (done) => {
    request(app)
      .post('/users')
      .send(testUsers[1])
      .expect(400)
      .end((err) => {
        if(err) {
          done(err);
        }
        User.find({email: testUsers[1].email}).then((user) => {
          expect(user.length).toBe(1);
          done();
        }).catch(e => done(e));
      })
  });
});

describe('GET /user/me', () => {
  it('should return user object', (done) => {
    request(app)
      .get('/users/me')
      .set({'x-auth': testUsers[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(typeof res.body.email).toBeDefined();
      })
      .end(done);
  });

  it('should return 401', (done) => {
    const token = jwt.sign({_id: new ObjectID().toHexString(), access: 'auth'}, 'abc123').toString();
    request(app)
      .get('/users/me')
      .set({'x-auth': token})
      .expect(401, done);
  });
});

describe('POST /users/login', () => {
  it('should login the registered user', (done) => {
    const reqBody = {email: testUsers[0].email, password: testUsers[0].password};
    request(app)
      .post('/users/login')
      .send(reqBody)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(reqBody.email);
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end(done);
  });
  it('should return 400, when email doesn\'t exist in DB', (done) => {
    const reqBody = {email: "example@example.com", password: "rohit123"};
    request(app)
      .post('/users/login')
      .send(reqBody)
      .expect(400,done);
  });
  it('should return 400, when entered incorrect password', (done) => {
    const reqBody = {email: "example@example.com", password: "rohit12"};
    request(app)
      .post('/users/login')
      .send(reqBody)
      .expect(400,done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should return 200, delete a particular token or (logout)', (done) => {
    const token  = testUsers[0].tokens[0].token;

    request(app)
      .delete('/users/me/token')
      .set({'x-auth': token})
      .expect(200, done);
  });
  it('should return 401, delete a particular token which doesnt exist or (already logout)', (done) => {
    const token  = jwt.sign({_id: new ObjectID().toHexString(), access: 'auth'}, 'abc123').toString();
    request(app)
      .delete('/users/me/token')
      .set({'x-auth': token})
      .expect(401, done);
  });
});