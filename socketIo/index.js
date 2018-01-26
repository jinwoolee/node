var express = require('express');
var app =  express();
var http = require('http').createServer(app);
var io = require("socket.io")(http); 

app.use(express.static(__dirname + "/public"));
/*
app.get("/", function(req, res){
    //res.send("hello world");
    res.sendFile(__dirname + "/index.html");
});
*/

io.on("connection", function(socket){
    console.log("손님 입장");

    //신규유저
    socket.on("new user", function(user){
        console.log('new user : ' + user.usernm);
        socket.broadcast.emit("user joined", user);
    });

    socket.on("disconnect", function(){
        socket.broadcast.emit("user left", {});
    });

    socket.on("chat msg", function(msg){
        //전송자를 제외 broad casting
        console.log("server receive : " + msg);
        io.emit("chat msg", msg);
        //socket.broadcast.emit("chat msg", msg);
    });
});

http.listen(3000, function(){
    console.log("listen *:3000");
})