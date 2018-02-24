function mdown(N)
{
var objs = document.getElementsByName(N);
var Body = document.getElementsByTagName('BODY')[0];
var j;

for (var i=j=0; i < objs.length; i++) { if (!objs[i].checked) continue; if (mdown.fList[j] == undefined) { mdown.fList[j] = document.createElement("IFRAME"); mdown.fList[j].style.display = 'none'; Body.appendChild(mdown.fList[j]); } mdown.fList[j].src = mdown.GetURL(objs[i].value); j++; } } mdown.fList = []; //---------------------------------------------------------------- // 사용자 정의 함수 구현부 //---------------------------------------------------------------- mdown.GetURL = function(val) { // 이 함수를 각자의 프로그램 사양에 따라 적당히 만들어주세요. // 체크박스에 있던 value 값이 val로 전달됩니다. return 'http://mysite.com/download.php?fileid='+val+');'; }