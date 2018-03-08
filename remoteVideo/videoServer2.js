var static = require('node-static');
var file = new(static.Server)();
var http = require('http');
var fs = require('fs');
var websocket = require('websocket').server;

var httpServer = http.createServer(function (req, res) {
    
    if(req.url.indexOf('caller.html') > 0 ||
       req.url.indexOf('callee.html') > 0 ||
       req.url.indexOf('.js') > 0 || 
       req.url.indexOf('.css') > 0 )
            file.serve(req, res);
});

var websocket_server = new websocket({
    httpServer: httpServer,
    autoAcceptConnections : true
});

var connectionList = [];
var idIndex = 0;
websocket_server.on('connect', function(conn){
    console.log("websocket_server.on('connect')");

/*websocket_server.on('request', function(request){    
    console.log("websocket_server.on('request11')");
    var conn = request.accept(null, request.origin);*/

    //임의 아이디 부여
    conn.id = 'ID_' + idIndex++;

    connectionList.push(conn);
    connectionList.forEach(function(item, idx){
        console.log('connectionId : ', item.id);
    });

    conn.on('message', function(message) {
        console.log('message : ', message);
        if(message.type == 'utf8'){
            data = JSON.parse(message.utf8Data);
            
            //if(data.type == 'join'){
                connectionList.forEach(function(item){
                    if(item.id != conn.id){
                        console.log("from ", conn.id, ' ==> to : ', item.id);
                        data.joinid = conn.id;
                        item.send(JSON.stringify(data));
                    }
                });
            //}
            
        }
    });

    conn.on('close', function(reasonCode, description){

        console.log('reasonCode : ', reasonCode);
        console.log('description : ', description);
        console.log('before delete connectionList.length : ', connectionList.length);

        var delIdx = -1;
        connectionList.forEach(function(item, idx){
            if(item.id == conn.id)
                delIdx = idx;
        });

        if(delIdx > 0)
            connectionList.splice(delIdx, 1);
        console.log('after connectionList.length : ', connectionList.length);
    });    
});

httpServer.listen(3000);