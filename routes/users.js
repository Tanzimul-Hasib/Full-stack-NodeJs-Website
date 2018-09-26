var  express=require('express');
var router=express.Router();
var User=require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Registration page
router.get('/register',function (req,res) {
    res.render('register')
});

//Login
router.get('/login',function (req,res) {
    res.render('login')
});


// Register User
router.post('/register',function (req,res) {

        //adding from data to variable
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Form validation
    req.checkBody('name','Name is empty').notEmpty();
    req.checkBody('username','Userame is empty').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Invalid Email').isEmail();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);
    console.log(name+' is trying to register with password '+password);

    var errors =req.validationErrors();

    if (errors){
        res.render('register',{errors:errors});
    }
    else {
        var newUser= new User({
            name : name,
            username:username,
            email:email,
            password:password
        });

        User.createUser(newUser,function (err,user) {
            if (err){throw err};
            console.log(user);
        });

        req.flash('success_msg','You are registered, Login Now');
        res.redirect('/users/login')
    }
});

//Passport js login auth
app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true })

        res.redirect('/');
    });







module.exports= router;