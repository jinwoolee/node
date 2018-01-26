$(function(){
    var socket = io();

    socket.emit("new user", {"usernm": "brown"});
    
    var $chat = $("#chat");
    var $chatCont = $("#chatCont");

    $("#frm").submit(function(){
        var msg = chat.val();
        socket.emit("chat msg", msg);

        $chat.val("");
        return false;
    });

    socket.on("chat msg", function(msg){
        console.log("client receive : " + msg);
        $chatCont.append("<li>" + msg + "</li>");
    });

    socket.on("user joined", function(user){
        console.log("user joined : " + user.usernm);
        $chatCont.append("<li> user joined : " + user.usernm + "</li>");
    });

    socket.on("user left", function(){
        console.log("user left " );
        $chatCont.append("<li> user left </li>");
    });
});