
/**
 * Module dependencies.
 */
require('./user-model');

var express = require('express');
var routes = require('./routes');
var mainPage = require('./routes/main')
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('shhhhhh'));
app.use(express.cookieSession())
// app.use(express.session({ store : new RedisStore,
// 						  secret : 'shhhhhh',
// 						  cookie : {
// 						  	maxAge : 24 * 60 * 60 * 1000
// 						  }
// 						}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/register', routes.register);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/main', mainPage.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
