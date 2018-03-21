var static = require('node-static');
var file = new(static.Server)();
var http = require('https');
var fs = require('fs');
var websocket = require('websocket').server;

var httpServer = http.createServer(
    {
        key:  fs.readFileSync("/home/pi/key/iothome_iptime_org.key"),
        cert: fs.readFileSync("/home/pi/key/iothome_iptime_org.crt")
    },
    function (req, res) {
        if(req.url.indexOf('videoClient.html') > 0 ||
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

    //임의 아이디 부여
    //conn.id = 'ID_' + idIndex++;
    //conn.send(JSON.stringify({type : 'registId', id : conn.id}));

    connectionList.push(conn);
    /*connectionList.forEach(function(item, idx){
        console.log('connectionId : ', item.id);
    });*/
    
    conn.on('message', function(message) {
        //console.log('conn.on message');
        if(message.type == 'utf8'){
            data = JSON.parse(message.utf8Data);
            console.log('conn.on message data.type : ', data.type );
            
            if(data.type == 'join'){
                conn.id = data.id;
                connectionList.forEach(function(item){
                    if(item.id != conn.id){
                        data.id = conn.id;
                        item.send(JSON.stringify(data));
                    }
                });
            }
            else if(data.type == 'new_description'){
                connectionList.forEach(function(item){
                    console.log('connectionList id : ', item.id, ', data.to : ', data.to, '\n');
                    if(item.id == data.to){   
                        data.id = conn.id;
                        item.send(JSON.stringify(data));
                    }
                });
            }
            else{
                connectionList.forEach(function(item){
                    if(item.id != conn.id){
                        data.id = conn.id;
                        item.send(JSON.stringify(data));
                    }
                });
            }
        }
    });

    conn.on('close', function(reasonCode, description){
        console.log('close id : ', conn.id);
        console.log('reasonCode : ', reasonCode);
        console.log('description : ', description);
        console.log('before delete connectionList.length : ', connectionList.length);

        var delIdx = -1;
        connectionList.forEach(function(item, idx){
            if(item.id == conn.id)
                delIdx = idx;
            else{
                console.log('close id : ', conn.id, ' / to :', item.id);
                item.send(JSON.stringify({
                    type: 'close',
                    id : conn.id
                }));
            }
        });

        if(delIdx > 0)
            connectionList.splice(delIdx, 1);
        console.log('after connectionList.length : ', connectionList.length);
    });    
});

httpServer.listen(8079);