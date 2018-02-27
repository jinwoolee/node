var express = require('express');
//var querystring = require('qureystring');
var bodyParser = require('body-parser');

var app = new express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.post("/", function(req, res){
    /*var buffer = '';
    req.on('data', function(chunk){
        buffer += chunk;
    });

    req.on('end', function(req, res){
        var parsed = querystring.parse(req);
        var title = parsed.title;
        var message = parsed.message;
    });*/

    var title = req.body.title;
    var message = req.body.message;
    res.send('title : ' + title + ', message : ' + message);
});

app.listen('3000');