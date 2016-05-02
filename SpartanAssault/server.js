var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var models = require("../config/models");

require('./config/passport')(passport, app);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'randomstringforspartanassault' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport);

models.sequelize.sync().then(function () {
	app.listen(port);
	console.log('Listening on port ' + port);
});