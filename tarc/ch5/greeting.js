module.exports.hello = function(){
    console.log("Hello World");
}

//module.exprots를 이용하지 않은 함수는 사용불가
function notExports(){
    console.log("notExports");
}