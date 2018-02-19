var intVal = 3;
var obj = {
    name : "NodeJs",
    how : "Interesting"
}

console.log("hello world");
console.log(intVal);
console.log("obj", obj);

console.time("TIMER");
var sum = 0;
for(var i = 0; i < 10000; i++)
    sum += i;
console.log("sum : ", sum);
console.timeEnd("TIMER");