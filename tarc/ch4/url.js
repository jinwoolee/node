var url = require('url');
var urlStr = 'http://idols.com/hot/q?group=EXID&name=하니&since&group=ses';

var parsed = url.parse(urlStr, true);       //urlString, query parse 분석여부

console.log(parsed);
console.log(parsed.query);
