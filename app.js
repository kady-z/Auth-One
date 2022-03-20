require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path-posix');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); 

path.resolve(__dirname + 'foo');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true    
}));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String 
});

userSchema.plugin(passportLocalMongoose);

const user = new mongoose.model('User', userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/register", function (req, res) {
});

app.post("/login", function(req, res) {
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server is running on port: " + port);
});
