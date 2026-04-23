var express = require('express')
var app = express()
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
app.use(express.static(path.join(__dirname, 'Public')));


var URI = 'mongodb://Hung:hungvn1234@ac-abp0quy-shard-00-02.9g2z1dq.mongodb.net:27017/airblinnk?ssl=true&authSource=admin';
mongoose.connect(URI).then(() => console.log('No issue with MongoDB.')).catch(err => console.log(err));


app.set('views','./views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
	name: 'userid', 
	secret: '100 phan tram bi mat ',
	resave: false, 
	saveUninitialized: false,  
	cookie: {maxAge: 6*60*60*1000} 
}));
app.use((req, res, next) => { 
    res.locals.session = req.session;   
    var err = req.session.error; 
    var msg = req.session.success; 
    delete req.session.error; 
    delete req.session.success;
    next();
});

app.listen(2200, () => {console.log(`localhost:2200`)});


var index = require('./router/index');
var Verifi = require('./router/Verifi');
var Account = require('./router/Account');
var Flight = require('./router/Flights');
var Booking = require('./router/Booking');


app.use('/', index);
app.use('/', Verifi);
app.use('/account', Account);
app.use('/flight', Flight);
app.use('/booking', Booking);