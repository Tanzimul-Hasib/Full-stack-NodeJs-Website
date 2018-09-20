var express= require('express');
var path=require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expHandlebars =require('express-handlebars');
var expValodator =require('express-validator');
var flash=require('connect-flash');
var session = require('express-session');
var passport= require('passport');
var localStrategy= require('pasport-local'),Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/loginapp');
var db =mongoose.connections;

var routes=require('./routes/index')
var users=require('./routes/users')
// Initialize app
var app= express();

//view Engine setup
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars',expHandlebars({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//Middlewere setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//Set public folder
app.use(express.static(path.join(__dirname,'public')));

//Express session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave: true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());
// Express validator #catvan *Middlewere
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    };
}));

//Connect-Flash Middlewere

app.use(flash());

//Global varibles
app.use(function (req,res,next) {
    res.local.success_msg= req.flash('success_msg');
    res.local.erorr_msg= req.flash('erorr_msg');
    res.local.erorr= req.flash('erorr');
    next();
})

app.use('/' , routes);
app.use('/users', users);


app.set('port',(process.env.PORT || 3000 ));
app.listen(app.get(port),function () {
  console.log('Server started at port'+ app.get(port));
});













