var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser')
var app = express();

app.set('views', './views/pages');
app.set('view engine', 'jade');//模板引擎
app.use(bodyParser.urlencoded());
app.use(serveStatic('bower_components'));
app.listen(port);
console.log('server listen on port' + port);

//index page
app.get('/',function (req, res) {
    res.render('index',{
        title:'首页',
        movies:[{
            title:'机械战警',
            _id:1,
            poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title:'机械战警',
            _id:2,
            poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'

        },{
            title:'机械战警',
            _id:3,
            poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'

        }
        ]
    })
});

app.get('/movie/1',function (req, res) {
    res.render('detail',{
        title:'详情页',
        movies:{
            doctor:"vnjjnvke",
            country:"美国",
            year:2014,
            poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
            language:"英语",
            flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
            summary:"jocrenv 哦vjegrvun克里夫ioa妇女哦色妇女哦而努力啊诶哦如今阿"
        }
    })
});

app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
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



app.get('/admin/list',function (req, res) {
    res.render('list',{
        title:'列表页',
        movies:[{
            title:'机械战警',
            _id:1,
            doctor:"vnjjnvke",
            country:"美国",
            year:2014,
            language:"英语",
            flash:"http://player.youku.com",
            summary:"jocrenv 哦vjegrvun克里夫ioa妇女哦色妇女哦而努力啊诶哦如今阿"
        }]
    })
});
