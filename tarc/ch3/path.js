var pathUtil = require("path");
var parsed = pathUtil.parse("/nodeworkspace/tarc/ch3/path.js");

console.log(parsed);
console.log(parsed.base);
console.log(parsed.ext);