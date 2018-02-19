var util = require("util");
function Parent(){

}
Parent.prototype.sayHello = function(){
    console.log("sayHello");
}

var parent = new Parent();
parent.sayHello();

function Child(){

}

util.inherits(Child, Parent);
var child = new Child();
child.sayHello();