var http = require("http");

http.createServer(function(request, response){
    response.writeHead(200, {"Content-type" : "text/html"});
    response.write("hello world");
    response.end("!!");
}).listen(3000);