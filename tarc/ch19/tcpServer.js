var net = require('net');
var server = net.createServer(function(socket){

    console.log('클라이언트 접속');
    socket.write('Welcome to Socket Server');

    socket.on('data', function(chunk){
        console.log('클라이언트 전송 : ', chunk.toString());
    });

    socket.on('end', function(chunk){
        console.log('클라이언트 접속 종료');
    });
});

/*server.on('listening', function(){
    console.log('Server is listening');
});

server.on('close', function(){
    console.log('Server closed');
});*/

server.listen(3000);