var fs = require('fs');
var os = fs.createWriteStream("./output.txt");

os.on("finish", function(){
    console.log("finish");
});

os.write("1234");
os.write("5678");
os.end("9");        //finish event