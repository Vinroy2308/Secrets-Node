//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
        extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
        email: String,
        password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/",function(req, res) {
        res.render("home");
});

app.get("/login",function(req, res) {
        res.render("login");
});

app.get("/register",function(req, res) {
        res.render("register");
});

app.post("/register", function(req, res) {
        const newUser = new User({
                email : req.body.username,
                password: md5(req.body.password)
        });
        newUser.save().then(function() {
                res.render("secrets");
        }).catch(function(error) {
                console.log(error);
        });
});

app.post("/login", function(req, res) {
        const username = req.body.username;
        const pass = md5(req.body.password);
        User.findOne({email: username}).then(function(foundUser) {
                if(foundUser.password === pass) {
                        res.render("secrets");
                }
        }).catch(function(err) {
                console.log(err);
        });
});



// App listen 
app.listen(3000, function() {
        console.log("Server started on Port 3000");
})
