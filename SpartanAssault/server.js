var express  = require('express');
var app      = express();
var port     = process.env.PORT || 9999;

//require('./config/database')(app);

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Listening on port ' + port);