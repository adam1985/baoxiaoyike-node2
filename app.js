
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fetch = require('./routes/fetch')
  , update = require('./routes/update')
  , remote = require('./routes/remote')
  , postWeixin = require('./routes/postWeixin')
  , getWeixin = require('./routes/getWeixin')
  , getView = require('./routes/getView')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/fetch', fetch.fetchresult);
app.post('/update', update.updateData);
app.post('/remote', remote.post);
app.get('/postWeixin', postWeixin);
app.get('/getWeixin', getWeixin);
app.get('/getView', getView);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});