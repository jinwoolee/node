var fs = require("fs");

//비동기 
//존재하는 파일
console.log("async file read=================================");
fs.readFile("./helloWorld.txt", "utf-8", function(err, data){
    if(err)
        console.log("file not found");
    else
        console.log(data);
});
 
//존재하지 않는 파일 : 에러
fs.readFile("./helloWorldNotExists.txt", "utf-8", function(err, data){
    if(err)
        console.log("file not found");
    else
        console.log(data);
});
console.log("async file read=================================\n");

//동기 
//존재하는 파일
console.log("sync file read=================================");
try{
    var data = fs.readFileSync("./helloWorld.txt", "utf-8");
    console.log(data);
}catch(exception){
    console.log("file not found");
}

//존재하지 않는 파일 : 에러
try{
    var data = fs.readFileSync("./helloWorldNotExists.txt", "utf-8");
    console.log(data);
}catch(exception){
    console.log("file not found");
}
console.log("sync file read=================================");