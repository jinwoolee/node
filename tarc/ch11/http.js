var server = require('http');

server.createServer(function(req, res){
    
    //입력 요청
    if(req.method.toLocaleLowerCase() == 'post')
        write(req, res);
    //조회
    else
        list(req, res);
}).listen("3000");

//리스트 출력
function list(req, res){
    res.write("<html>");
    res.write(" <head><meta charset='utf-8'/><title>movie list</title></head>");
    res.write(" <body>");
    res.write(" <div id='list'>");
    res.write("     <ul></ul>");
    res.write(" </div>");

    res.write(" <div id='write'>");
    res.write(" <form method='post' action='/'>")
    res.write("     <ul>");
    res.write("         <li>영화제목 : <input type='text' name='title' value='영화제목'/> </li>");
    res.write("         <li>영화감독 : <input type='text' name='director' value='영화감동'/> </li>");
    res.write("         <li>연도 : <input type='text' name='year' value='2017'/> </li>");
    res.write("         <li>포스터 : <input type='file' name='poster'/> </li>");
    res.write("         <li><input type='submit' value='전송'/> </li>");
    res.write("     </ul>");
    res.write(" </form>");
    res.write(" </div>");
    res.write(" </body>");
    res.end();
}

//입력
function write(req, res){
    res.write("start write");
    req.on("data", function(chunk){
        console.log("data length : " + chunk.length)
        res.write("data length : " + chunk.length);    
    });

    req.on("end", function(chunk){
        console.log("data length : " + chunk.length)
        res.write("data length : " + chunk.length);
    });

    res.write("end write");
    res.end();
}