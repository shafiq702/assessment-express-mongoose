// BUILD A MODULE THAT PASSES THE TESTS IN THE MODEL TEST FILE

var Todos = function () {
	this.names = [];
	this.task = {};
	//this.task = {'zeke': [task0, task1, task2]}
}

Todos.prototype.listPeople = function () {  	
	return this.names;
}

Todos.prototype.add = function (name, obj) {
	this.names.push(name);

	if(!this.task[name]){
		this.task[name] = [obj]
		obj.complete = false;
	}else{
		this.task[name].push(obj);
	}
}

Todos.prototype.list = function(name) {
	return this.task[name];
}

Todos.prototype.complete = function(name, index){
	this.task[name][index].complete = true;
}

Todos.prototype.remove = function(name, index){
	this.task[name].splice(index, 1);
}

Todos.prototype.reset = function(){
	this.names = [];
	this.task = {};
}

module.exports = new Todos();

