function task1(fullfill, reject){
    console.log('Task1 시작');
    setTimeout(function(){
        console.log('Task1 끝');
        //fullfill("Task1 결과");
        reject('task1 error');
    }, 300);
}

function fullfilled(result){
    console.log('fullfilled : ' + result);
}

function rejected(error){
    console.log('rejected : ' + error);
}

new Promise(task1).then(fullfilled, rejected);