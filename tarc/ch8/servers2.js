var http = require('http');
var url = require('url');

//localhost:3000?start=1&end=5
var server = http.createServer(function(req, res){
    //url 분석
    var parsed = url.parse(req.url, true);
    var query = parsed.query;

    var start = parseInt(query.start);
    var end = parseInt(query.end);

    if( !start || !end){
        res.statusCode = 500;
        res.end("Wrong Parameter");
    }
    else{
        var result = 0;
        for(var i = start ; i <= end; i++)
            result += i;

        //res.statusCode
        res.end("Result : " + result);
    }
}).listen(3000);
