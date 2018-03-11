var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode

app.get('/', function(req, res){
    res.send('hello world');
});

app.get('/login', function(req, res){
    /*var html = '<input type="text" name="id" placeholder="id"><br>';
    html += '<input type="password" name="pw" placeholder="pw"><br>';
    res.send(html);*/

    res.sendFile(__dirname + "/login.html");
});

app.post('/login', function(req, res){
    var id = req.body.id;
    var pw = req.body.pw;
    
    res.send(login(id, pw));
    res.end();
});

function login(id, pw){
    return 'user' == id && 'pass' == pw;
}
app.listen(3000, function(){console.log('server statred')});