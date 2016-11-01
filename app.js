var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
// var Movie = require('./models/movie');
// var User = require('./models/user');

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
// var _ = require('underscore');//js实用库

var cookieParser = require('cookie-parser');
// var session = require('cookie-session');


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

mongoose.connect('mongodb://localhost/imooc-movie');

app.locals.moment = require('moment');//引入时间的库

app.set('views', './views/pages');
app.set('view engine', 'jade');//模板引擎
app.use(bodyParser.urlencoded());
app.use(serveStatic('public'));
// app.use(express.cookieParser);
app.use(cookieParser());

app.use(session({
    secret: 'imooc',
    store: new MongoStore({
        url: 'mongodb://localhost/imooc-movie',
        connection: 'sessions'
    })
}));

require('./config/routes')(app);
app.listen(port);
console.log('server listen on port' + port);


