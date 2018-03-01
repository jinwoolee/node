var express = require('express');
var bodyParser = require('body-parser');


var fs = require('fs');

var app = express();
var movieList = [];
var initialDb = fs.readFileSync('./initialDB.json');
movieList = JSON.parse(initialDb);

/*Express를 이용해서 RESTful 서비스 작성
1. 영화 목록과 영화 상세보기 : JSON (OK)
2. 영화 리뷰 기능 추가 : JSON (OK)
3. 라우터 분리  (OK)
4. 템플릿 적용*/

//json body parser
app.use(bodyParser.json());

//static resource
app.use(express.static('./'));

//ejs
app.set('view engine', 'ejs');
app.set('views ', __dirname + '/views');

//영화목록 : localhost:3000/movies
app.get('/movies', function(req, res){
    res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
    
    var movies = [];
    movieList.forEach(function(item){
        movies.push({movieId : item.movieId, title : item.title});
    });
    //res.end(JSON.stringify(movies));
    res.end(JSON.stringify(movieList));
});

//영화 상세 : localhost:3000/movie/movieId
app.get('/movie/:movieId', function(req, res){
    res.writeHead(200, {'Content-Type' : 'application/json; charset=utf-8'});
    var movieId = req.params.movieId;
    var movie;
    movieList.forEach(function(item){
        if(movieId == item.movieId)
            movie = item;
    });

    if( movie != null)
        res.end(JSON.stringify(movie));
    else
        res.end(JSON.stringify({message : 'no movie'}));
});

//영화 리뷰 추가
app.post('/review', function(req, res){
    var movieId = req.body.movieId;
    var review = req.body.review;

    movieList.forEach(function(item){
        console.log('item.movieId : ', item.movieId, '\n');

        if(movieId == item.movieId){
            console.log('item.reviews : ', item.reviews);
            item.reviews.push({review : review});
        }
    });
    
    res.redirect('/movies');
    //res.end(JSON.stringify(movieList));
});

//view
app.get('/movieView', function(req, res){
    res.render('movieView', {title : 'movieView', movieList : movieList});
});

app.listen(3000);