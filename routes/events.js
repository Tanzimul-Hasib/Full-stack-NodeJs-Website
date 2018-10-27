var express				=	require('express');
var router 				= 	express.Router();
var appText				= 	require('../settings/en-lang.js');
var moment 				=	require('moment');

// **************************************************get request******************************************************

//homepage
router.get('/',function (req,res) {
    res.render('listEvent',{
    	title:"test",
    	appText:appText,
    	moment: moment
    });
});
// Event/add page
router.get('/add',function (req,res) {
    res.render('addEvent',{
    	title:"test",
    	appText:appText,
    	moment: moment
    });
});
// Event/add page
router.get('/edit',function (req,res) {
    res.render('editEvent',{
    	title:"test",
    	appText:appText,
    	moment: moment
    });
});

// **************************************************Post request******************************************************






















































function ensureAuthenticated(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }
     else {
         //req.flash('error_msg','You are not logged in');
         res.redirect('/users/login');
     }
};
module.exports= router;