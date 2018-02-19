
var util = require("util");
var events = require("events");

function Person(){
}

util.inherits(Person, events.EventEmitter);

var person = new Person();
person.on("click", function(){
    console.log("click");
});


person.emit("click");

process.on("uncaughtException", function(code){
    console.log("uncaughtException : ", code);
});

//존재하지 않는 메소드 호출
sayHello();