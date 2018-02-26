var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var movieList = [];

var server = http.createServer(function(req, res){
    var method = req.method.toLowerCase();
    var url = req.url;
    
    

    if(method == 'post')
        handlePost(req, res);
    else if(method == 'get' && (url.indexOf("png") > 0 || url.indexOf("jpg") > 0)){
        console.log('req.headers', req.headers);
        var path = __dirname + req.url;
        res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        fs.createReadStream(path).pipe(res);
    }
    else
        showList(req, res);
});

server.listen(3000);

function handlePost(req, res){
    var uploadDir = __dirname + "/upload/";
    var posterDir = __dirname + "/poster/";
    var form = formidable.IncomingForm();
    form.uploadDir = uploadDir;
    
    form.parse(req, function(err, fields, files){
        var title = fields.title;
        var director = fields.director;
        var year = fields.year;
        var poster = files.poster;

        var date = new Date();
        var newImageName = 'image_' + date.getHours() + date.getMinutes() + date.getSeconds();
        var ext = path.parse(poster.name).ext;
        
        console.log('newImageName : ', newImageName );
        console.log('ext : ', ext);
        fs.copyFileSync(poster.path, posterDir + newImageName + ext);

        var posterJson = {title : title, director : director,
                          year : year, posterUrl : "/poster/" + newImageName + ext };
        movieList.push(posterJson);

        /*res.redirect("/");
        res.end();*/
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end('Success');
    });
}

function showList(req, res){
    res.write("<html>");
    res.write(" <head><meta charset='utf-8'/><title>movie list</title></head>");
    res.write(" <body>");
    res.write(" <div id='list'>");
    res.write("     <ul>");
    
    movieList.forEach(function(item, index){
        res.write("<li>")
        res.write("<img src='" + item.posterUrl + "'>");
        res.write(item.title + "(" + item.director + ", " + item.year +")");
        res.write("</li>")
    });

    res.write("     </ul>");
    res.write(" </div>");

    res.write(" <div id='write'>");
    res.write(" <form method='post' action='/' enctype='multipart/form-data'>")
    res.write("     <ul>");
    res.write("         <li>영화제목 : <input type='text' name='title' value='영화제목'/></li>");
    res.write("         <li>영화감독 : <input type='text' name='director' value='영화감독'/></li>");
    res.write("         <li>연도 : <input type='text' name='year' value='2017'/></li>");
    res.write("         <li>포스터 : <input type='file' name='poster'/></li>");
    res.write("         <li><input type='submit' value='전송'/></li>");
    res.write("     </ul>");
    res.write(" </form>");
    res.write(" </div>");
    res.write(" </body>");
    res.end();
}