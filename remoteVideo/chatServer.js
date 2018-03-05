var WebSocketServer = require('websocket').server;
var http = require('http');

var fs = require('fs');

var connectionArray = [];

var server = http.createServer(function(req, res){
    
    if(req.url.indexOf("list") > 0){
        res.end(connectionArray.toString());
    }
    else if(req.url.indexOf("view") > 0){        
        fs.readFile('./chatClient.html', function(err, data){
            res.end(data);
        });
    }
    else{
        res.end("test");
    }
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true // You should use false here!
});

wsServer.on('connect', function(id) {
    console.log('wsServer connect');

    connectionArray.push(id);

    id.send(JSON.stringify({type:'connected', msg : 'connected'}));

    id.on('message', function(message){
        console.log(message);
        //var data = JSON.parse(message);

        if(message.type == 'utf8'){
            connectionArray.forEach(function(connection, idx){
                connection.send(message.utf8Data);
            });
        }
        else if(message.type == 'binary'){
            console.log('binary');
        }
    });

  /*var msg = {
    type: "id",
    id: connection.clientID
  };
  connection.sendUTF(JSON.stringify(msg));*/
});



server.listen(3000);
