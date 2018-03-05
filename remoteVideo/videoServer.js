var http = require("http");
var fs = require("fs");
var websocket = require("websocket").server;

var connection = [];
var webrtc_discussions = {};

var httpServer = http.createServer(function(req, res){
    
    console.log('req.url : ', req.url);

    if(req.url.indexOf('view') > 0){
        fs.readFile('./videoClient.html', function(err, data){
            res.end(data);
        });
    }
    else if(req.url.indexOf('list') > 0){
        res.end(connection.toString());
    }
});

var websocket_server = new websocket({
    httpServer: httpServer/*,
    autoAcceptConnections : false*/
});

//websocket_server.on('connect', function(conn){
websocket_server.on('request', function(request){
    console.log('connected');

    var conn = request.accept(null, request.origin);
    connection.push(conn);

    conn.id = connection.length-1;    

    conn.on('message', function(message){
        console.log('message : ', message);

        if (message.type === "utf8") {
            var signal = JSON.parse(message.utf8Data);

            if (signal.type === "join" && signal.token !== undefined) {
                if (webrtc_discussions[signal.token] === undefined) {
                    webrtc_discussions[signal.token] = {};
                }

                webrtc_discussions[signal.token][conn.id] = true;
            }
            else if (signal.token !== undefined) {
                console.log('not join');
                Object.keys(webrtc_discussions[signal.token]).forEach(function(id) {
                    if (id != conn.id) {
                        connection[id].send(message.utf8Data);
                    }
                });
            } 
            console.log('connection :' , connection.length);
            console.log('webrtc_discussions :' , webrtc_discussions);
        }
    });
})

httpServer.listen(3000);