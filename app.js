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

// Initialize app

var app= express();