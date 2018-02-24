var fs = require('fs');
var os = fs.createWriteStream("./output.txt");

os.on("finish", function(){
    console.log("finish");
});

//키보드입력(stdin)을 파일로 출력
var is = process.stdin;
is.pipe(os);