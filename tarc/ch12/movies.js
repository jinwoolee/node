var http = require('http');
var fs = require('fs');

var data = fs.readFileSync('./movieData.json')
var movieList = JSON.parse(data);

http.createServer(function(req, res){
    var method = req.method.toLowerCase();

    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    
    switch(method){
        case 'get' : 
            handleGetRequest(req, res);
            return;
        
        case 'post' :
            handlePostRequest(req, res);
            return;
        
        case 'put' :
            handlePutRequest(req, res);
            return;
        case 'delete' :
            handleDeleteRequest(req, res);
            return;            
    }
    
}).listen("3000");

function handleGetRequest(req, res){
    res.end(JSON.stringify({totalCount : movieList.length, data : movieList}));
}

function handlePostRequest(req, res){
    res.end('post');
}

function handlePutRequest(req, res){
    res.end('put');
}

function handleDeleteRequest(req, res){
    res.end('delete');
}