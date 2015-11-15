var request = require('supertest-as-promised')(require('../app'))
var expect = require('chai').expect
var todos = require('../models/todos')


describe('Todo routes', function() {
  beforeEach(function() {
    todos.reset()
  })

  describe('/', function() {
    it('responds with an empty array when app boots', function() {
      /*
       * when we make requests to `/` we will get back an empty array
       * */
       return request
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.eql([])
        })
    })

    it('responds with a person after a task has been added', function() {
      todos.add('zeke', { name: 'a task' })
      return request
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.eql(['zeke'])
        })
    })

  })

  describe('/:person', function() {
    it('lists tasks for a user with a get request', function() {
      todos.add('bob', { name: 'task for bob' })
      return request
        .get('/bob')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.have.length(1)
          expect(res.body[0].name).to.equal('task for bob')
          expect(res.body[0].complete).to.equal(false)
        })
    })

    it('adds to the person\'s task list with a post request', function() {
      return request
        .post('/sarah')
        .send({ name: 'one of sarah\'s tasks'})
        .expect(201)
        .expect(function(res) {
          expect(res.body.name).to.equal('one of sarah\'s tasks')
          expect(todos.list('sarah')).to.have.length(1)
          expect(todos.list('sarah')[0].name).to.equal('one of sarah\'s tasks')
        })
    })

    describe('filtering by status', function () {
      beforeEach(function () {
        todos.add('billy', {name: 'learn about req.query'})
        todos.complete('billy', 0);
        todos.add('billy', {name: 'enable requests for specific todos'})
      });

      it('can get only completed tasks', function () {
        return request
          .get('/billy?status=complete')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).to.have.length(1)
            expect(res.body[0].name).to.equal('learn about req.query')
          })
      })

      it('can get only active tasks', function () {
        return request
          .get('/billy?status=active')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).to.have.length(1)
            expect(res.body[0].name).to.equal('enable requests for specific todos');
          })
      })
    })

    describe('/:index', function()  {
      it('marks a task as complete with a put request', function() {
        todos.add('seema', {})
        todos.add('seema', {})
        todos.add('seema', {})

        return request
          .put('/seema/2')
          .expect(200)
          .expect(function() {
            expect(todos.list('seema')[2].complete).to.be.true
          })
      })

      it('removes a task with a delete request', function() {
        todos.add('david', {})
        todos.add('david', {})
        todos.add('david', {})

        return request
          .delete('/david/2')
          .expect(204)
          .expect(function() {
            expect(todos.list('david')).to.have.length(2)
          })
      })
    })

    describe('errors', function() {
      it('sends back a 404 if a user does not exist', function () {
        return request
          .get('/obama')
          .expect(404)
      })

      it('sends back a 400 if you attempt to add a todo with non-standard field', function () {
        return request
          .post('/bob')
          .send({thisField: 'is neither `name` nor `complete` and so is not allowed'})
          .expect(400)
      })
    })
  })
 })
