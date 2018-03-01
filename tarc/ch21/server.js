var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'Secret Key'
}));

app.use(bodyParser.urlencoded({extended:false}));

app.post('/login', handleLogin);
app.get('/personal', showPersonalPage);
app.listen(3000);

function handleLogin(req, res){
    console.log('req.body : ', req.body);
    var id = req.body.id;
    var pw = req.body.pw;
    console.log('handleLogin : ', id, ', ', pw);

    if(id === 'user' && pw === '1234'){
        req.session.userid = id;
        res.send('success');
    }
    else{
        res.send('Fail');
    }
}

function showPersonalPage(req, res){
    console.log('showPersonalPage');
    var id = req.session.userid;
    if( id )
        res.send('Private Page for : ' + id);
    else
        res.sendStatus(401);
}