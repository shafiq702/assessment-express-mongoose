var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var todos = require('./models/todos.js')
var routes = require('./routes/')
module.exports = app //this line is only used to make testing easier
// REMEMBER TO PLUGIN YOUR ROUTERS HERE!

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (!module.parent){
	app.listen(process.env.PORT || 3000)
}

app.use('/', routes);

