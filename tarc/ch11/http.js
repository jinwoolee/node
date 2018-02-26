var server = require('http');
var formidable = require('formidable');
var pathUtil = require('path');
var fs = require('fs');

var tmpdir = __dirname + '/tmpdir/';
var postdir = __dirname + '/postdir/';

//poster
var posters = [];

server.createServer(function(req, res){
   
    var method = req.method.toLocaleLowerCase();

    //입력 요청
    if(method == 'post')
        write(req, res);
    //조회(list)
    else if(method == 'get'&& req.url.indexOf("list") > 0 )
        list(req, res);
    //기타 이미지
    else if(method == 'get'){
        var path = __dirname + req.url;
        res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        fs.createReadStream(path).pipe(res);
    }

}).listen("3000");

//리스트 출력
function list(req, res){
    res.write("<html>");
    res.write(" <head><meta charset='utf-8'/><title>movie list</title></head>");
    res.write(" <body>");
    res.write(" <div id='list'>");
    res.write("     <ul>");
    
    posters.forEach(function (item, index) {
        res.write("<li> <image src='" + item.posterUrl + "'/>" + item.title + "(" + item.director + ", " + item.year + "</li> ");
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

//입력
function write(req, res){
   
    var form = formidable.IncomingForm();
    form.uploadDir = tmpdir;
    
    console.log("write");
    
    form.parse(req, function(err, fields, files) {
        var title = fields.title;
        var director = fields.director;
        var year = fields.year;
        var poster = files.poster;
        
        var date = new Date();
        var newImageName = 'image_' + date.getHours() + date.getMinutes() + date.getSeconds();
        var ext = pathUtil.parse(poster.name).ext;
        var newPath = postdir + newImageName + ext;
        var posterUrl = '/postdir/' + newImageName + ext; 
         
        fs.renameSync(poster.path, newPath);

        var posterJson = {
            "title" : title,
            "director" : director,
            "year" : year,
            "posterUrl" : posterUrl
        }
        
        posters.push(posterJson);

        res.statusCode = 302;
        res.setHeader('Location', '/list');        
        res.end('Success');
    });
}