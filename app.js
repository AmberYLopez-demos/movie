var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var _ = require('underscore');//js实用库

var app = express();

mongoose.connect('mongodb://localhost/imooc-movie');

app.locals.moment = require('moment');//引入时间的库

app.set('views', './views/pages');
app.set('view engine', 'jade');//模板引擎
app.use(bodyParser.urlencoded());
app.use(serveStatic('public'));
app.listen(port);
console.log('server listen on port' + port);

//index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: '首页',
            movies: movies
        });
    });
});

app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    // res.send(req);
    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: '详情页',
            movie: movie
        })
    });
});

app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '详情页',
                movie: movie
            })
        });
    }

});

//注册
app.post('/user/signup',function (req, res) {
    var _user = req.body.user;//获取表单数据，是一个对象 也可用req.param('user')
    var user = new User(_user);
    user.save(function (err, user) {
        if(err) {
            console.log(err);

        }
    });
    // console.log(_user);

    res.redirect('/admin/userlist');

});

//用户列表页
app.get('/admin/userlist', function (req, res) {
    User.fetch(function (err, users) {
        if(err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users
        })
    });
});
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                // res.send(movie._id);
                res.redirect('/movie/' + movie._id);
            })
        })

        } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);//{"movie":{"_id":"undefined","title":"从你的全世界路过","doctor":"其他","country":"中国","language":"中文","poster":"其他","flash":"其他","year":"2016","summary":""}}
        })
    }
});

app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        res.render('list', {
            title: '列表页',
            movies: movies
        })
    });
});

app.delete('/admin/list',function (req, res) {
    var id = req.query.id;
        if(id) {
            Movie.remove({_id: id}, function (err, movie) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({success: 1});
                }
            });
        }
});
