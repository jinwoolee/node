var http = require('http');
var server = http.createServer(function(req, res){
    console.log("req.url : ", req.url);
    console.log("req.method : ", req.method);
    console.log("req.headers : ", req.headers);

    res.write("Hello world");
    res.end();
}).listen(3000);
