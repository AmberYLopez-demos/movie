var Movie = require('../models/movie');
var User = require('../models/user');
var _ = require('underscore');//js实用库

module.exports = function (app) {


    app.use(function (req, res, next) {
        var _user = req.session.user;
            app.locals = _user;
        return next();
    });

//index page
    app.get('/', function (req, res) {
        // console.log(req.session.user);//undefined
        var user = req.session.user;
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
    app.post('/user/signup', function (req, res) {
        var _user = req.body.user;//获取表单数据，是一个对象 也可用req.param('user')
        User.findOne({name: _user.name}, function (err, user) {
            if (err) {
                console.log(err)
            }
            if (user) {//用户名已存在
                return res.redirect('/');
            } else {
                var user = new User(_user);
                user.save(function (err, user) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.redirect('/admin/userlist');
            }
        })
    });

//登录
    app.post('/user/signin', function (req, res) {
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;

        User.findOne({name: name}, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {//用户不存在
                return res.redirect('/');
            }
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    console.log('密码不匹配');
                }
            })
        })
    });
//登出
    app.get('/logout', function (req, res) {

        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    });
//用户列表页
    app.get('/admin/userlist', function (req, res) {
        User.fetch(function (err, users) {
            if (err) {
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

    app.delete('/admin/list', function (req, res) {
        var id = req.query.id;
        if (id) {
            Movie.remove({_id: id}, function (err, movie) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({success: 1});
                }
            });
        }
    });
}
