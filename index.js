require('dotenv').config();
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var moviesRouter = require('./routes/movies');
var usersRouter = require('./routes/users');

app.use(express.static('web'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'web', 'register.html'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'web', 'login.html'));
});


app.use('/movies', moviesRouter);
app.use('/users', usersRouter);

app.listen(3000, function () {
    console.log('App is listening on port 3000!');
});
