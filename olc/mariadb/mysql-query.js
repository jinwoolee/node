var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'code',
  password : 'code',
  database : 'code'
});

connection.connect();

connection.query('select * from code.CD001', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
conenction