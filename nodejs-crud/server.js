var http 				= 	require('http');
var express 			=	require('express');
var app 				= 	express();
var mysql				= 	require('mysql');
var moment 				=	require('moment');
var flash 				= 	require('connect-flash');
var cookieParser 		= 	require('cookie-parser');
var bodyParser 			= 	require('body-parser');
var session 			= 	require('express-session');
var flash 				=	require('connect-flash');
var expressValidator 	= 	require('express-validator');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!
app.use(cookieParser('keyboard cat'));

app.use(session({
  secret: 'f{NW|DXB`*.rIgyL.E8:vaA[p*e#nP',
  resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Secure is Recommeneded, However it requires an HTTPS enabled website (SSL Certificate)
        maxAge: 864000000 // 10 Days in miliseconds
    }
}));

app.use(flash());


var appText	= 	require('./settings/en-lang');

//
app.set('view engine','ejs');

// adding bootstrap & jquery 
app.use('/js',express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/',express.static(__dirname + '/node_modules/moment'));
app.use('/js',express.static(__dirname + '/scripts/js'));
app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css',express.static(__dirname + '/styles/css'));

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'events'
});

connection.connect(function(err){
	if (err) {
		return;
	}
});


app.get('/',function(req,res)
{
	connection.query("SELECT * FROM e_events",function(err,result)
	{
		if (err){
			return;
		}
		res.render('pages/events/list',{
			appText:appText,
			moment: moment,
			items:result,
			error: req.flash('error'),
			success: req.flash('success')
		});
	});
});

app.get('/events/:id',  function(req,res)
{
	
	if (req.params.id == 'add')
	{
		res.render('pages/events/add',{
			appText:appText,
			moment: moment,
			items:null,
			error: req.flash('error'),
			success: req.flash('success'),
			formData:req.body
		});
	
	} else {

		connection.query("SELECT * FROM e_events WHERE e_id = ? ", req.params.id ,function(err,result)
		{
			if (err){
				return;
			}
			res.render('pages/events/edit',{
				appText:appText,
				moment: moment,
				item:result,
				error: req.flash('error'),
				success: req.flash('success'),
				formData:req.body
			});
		});	
	}
});

//
app.post('/events/:id' , function(req,res){
 

	if (req.params.id == 'add')
	{
		
		req.checkBody('e_name',  appText.lines.messages.events.errorEName).notEmpty();
		req.checkBody('e_desc',  appText.lines.messages.events.errorEDesc).notEmpty();
		req.checkBody('e_location',  appText.lines.messages.events.errorELocation).notEmpty();
		req.checkBody('e_start_date',  appText.lines.messages.events.errorEStartDate).notEmpty();
		req.checkBody('e_end_date',  appText.lines.messages.events.errorEEndDate).notEmpty();
		
		var error = req.validationErrors();
		var errorMessages = [];

		for (var i = error.length - 1; i >= 0; i--)
		{
			errorMessages.push(error[i].msg);
		}

		if ( error )
		{
			res.render('pages/events/add',{
				appText:appText,
				moment: moment,
				items:null,
				error: errorMessages,
				success: req.flash('success'),
				formData:req.body
			});

		
		}else {
		   
		   	// There are no errors so perform action with valid data (e.g. save record).
			var insertEventData = {
				e_name:req.body.e_name,
				e_location:req.body.e_location,
				e_desc:req.body.e_desc,
				e_start_date:moment(req.body.e_start_date).format('YYYY-MM-DD'),
				e_end_date:moment(req.body.e_end_date).format('YYYY-MM-DD'),
			}	

			connection.query("INSERT INTO e_events SET ? ", insertEventData , function(err,result){
				
				if (err){
				
					req.flash('error',appText.lines.messages.events.errorDB)
					res.redirect('/');

				}else{
					
					req.flash('success', appText.lines.messages.events.successAdded)
					res.redirect('/');
				}
			});
		}

	
	} else {
		
		connection.query("UPDATE e_events SET e_name = ?, e_desc = ? , e_location = ? , e_start_date = ? , e_end_date = ? WHERE e_id = ? ", [ req.body.e_name, req.body.e_desc , req.body.e_location, moment(req.body.e_start_date).format('YYYY-MM-DD'), moment(req.body.e_end_date).format('YYYY-MM-DD') , req.params.id ] , function(err,result){
			
			if (err){
			
				req.flash('error',appText.lines.messages.events.errorDB)
				res.redirect('/');

			}else{
				
				req.flash('success', appText.lines.messages.events.successUpdated)
				res.redirect('/');
			}
		});
	}

});

/*
*
* This is a git command
*/

app.get('/events/delete/:id' , function(req,res){

	connection.query("DELETE FROM e_events WHERE e_id = ? ",req.params.id , function(err,result){
		
		if (err){
			
			req.flash('error',appText.lines.messages.events.errorDB)
			res.redirect('/');

		}else{
			
			req.flash('success', appText.lines.messages.events.successDeleted)
			res.redirect('/');
		}
	});
});

app.listen(1000,'localhost',function(req,res){
	console.log("Listening 1000");
});