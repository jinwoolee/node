var querystring = require('querystring');
var str = 'group=EXID&name=하니&since&group=ses';

var parsed = querystring.parse(str);

console.log(parsed);