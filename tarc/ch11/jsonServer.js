var http = require("http");
var movieList = [{title:'아바타', director:'제임스 카메론'}];

http.createServer(function(req, res){
    var method = req.method.toLowerCase();
    console.log("method : ", method);

    var buffer = '';
    if(method == 'post'){
        req.on("data", function(chunk){
            buffer += chunk;
        });

        req.on("end", function(){
            
            console.log('buffer', buffer);

            var parsed = JSON.parse(buffer);
            console.log('parsed', parsed);

            var title = parsed.title;
            var director = parsed.director;

            movieList.push({title : title, director : director});
            
            res.writeHead(200, {'Content-type' : 'application/json'});
            res.end(JSON.stringify({result : 'success'}));
        });
    }
    else{
        var result = {
            count : movieList.length,
            data :  movieList
        };

        res.writeHead(200, {'Content-type' : 'application/json'});
        res.end(JSON.stringify(result));
    }
}).listen(3000);