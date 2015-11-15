var express = require('express')
var router = express.Router()
var todos = require('../models/todos');
var bodyParser = require('body-parser');
module.exports = router

// WRITE SOME ROUTES HERE

// FEEL FREE TO SPLIT INTO MULTIPLE FILES AS NEEDED

router.get('/', function(req, res, next) {
  var names = todos.listPeople();
  res.send(names);
  next();
});


//get name
router.get('/:person', function(req, res, next){
	var name = req.params.person;
	var tasks = todos.list(name);
  console.log(req.query.status)

  if(req.query.status === 'completed'){
    console.log(tasks)
    res.send(tasks);
  }else if(req.query.status === 'active'){
    res.send(tasks);
  }
  
  console.log(tasks.length);
  if(tasks === undefined){
    res.statusCode = 404;
  }
	 res.send(tasks);
  next();
})

//post
router.post('/:person', function(req, res, next){
  res.statusCode = 201;
  var name = req.params.person;
  var task = req.body;
  if(req.body.name === undefined){
    res.statusCode = 400;
  }
  todos.add(name, task);
  res.send(task)
})

//completed task
// router.get('/:person', function(req, res, next){
//   var name = req.params.person;
//   var compl = req.query.status;
//   var task = todos.list(name);
//   var arr = []
  
//   res.send(arr);
// })

// //active task
// router.get('/:person', function(req, res, next){
//   var name = req.params.person;
//   var compl = req.query.status;
//   var task = todos.list(name);
//   console.log(compl)
//    res.send();
// })

//put
router.put('/:person/:index', function(req, res, next){
  var num = req.params.index;
  var name = req.params.person;
  var updating = todos.complete(name, num);
  res.send(todos.list(name));
})

//delete
router.delete('/:person/:index', function(req, res, next){
  res.statusCode = 204;
  var num = req.params.index;
  var name = req.params.person;
  var updating = todos.remove(name, num);
  res.send(todos.list(name));

})




