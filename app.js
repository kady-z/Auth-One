require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path-posix');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

path.resolve(__dirname + 'foo');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
    
}));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String 
});

userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password'] });

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
    const newUser= new user({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    user.findOne({ email: username }, function( err, user ) {
        if (err) {
            res.send(err);
        } else {
            if (user) {
                if (user.password === password) {
                    res.render("secrets");
                } else {
                    res.send("Wrong Password !!!");
                }
            } else {
                res.send("User not found !!!");
            }
        }
});

});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server is running on port: " + port);
});
