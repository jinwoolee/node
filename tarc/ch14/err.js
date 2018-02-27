var express = require('express');
var app = express();

app.get('/:value', work);
app.use(errorHandler);

app.listen(3000);

function work(req, res, next){
    var val = parseInt(req.params.value);

    if( ! val){
        var error = new Error('숫자가 아닙니다.');
        next(error);
        return;
    }

    res.send('Reslut : ' + val);
}

function errorHandler(err, req, res, next){
    res.send('Error 발생');
}