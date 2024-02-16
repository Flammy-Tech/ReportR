'use strict';
var express = require('express');
const bodyParser = require('body-parser');

var port = 3000;

var app = express();

app.set('view engine', 'ejs');


// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));


//Static files
app.use(express.static('public'))
app.use('css', express.static(__dirname + 'public/css'));
app.use('js', express.static(__dirname + 'public/js'));
app.use('assets', express.static(__dirname + 'public/assets'));



//Setup routes

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var studentRouter = require('./routes/student');

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/student', studentRouter);

app.listen(port, function () {
        console.log(`listening on port localhost ${port}`);
    });
