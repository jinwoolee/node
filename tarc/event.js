
var util = require("util");
var events = require("events");

function Person(){
}

util.inherits(Person, events.EventEmitter);

var person = new Person();
person