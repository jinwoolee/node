var http = require('http');
var server = http.createServer(function(req, res){
    res.statusCode = 200;
    res.statusMessage = "ok-ok";
    res.setHeader("content-type", "text/plain");

    console.log("req.url : ", req.url);
    console.log("req.method : ", req.method);
    console.log("req.headers : ", req.headers);

    res.write("<html><body><h1>Hello World</h1></body></html>");
    res.end();
}).listen(3000);
