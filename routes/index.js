var express     = require('express'),
    passport    = require('passport'),
    router      = express.Router(),
    User        = require('../models/user'),
    middleware  = require('../middleware');

//Home
router.get("/", function(req, res){
    res.render("home");
});

//Login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/works",
    failureRedirect: "/login",
    failureFlash: "Datos Incorrectos",
    successFlash: "¡Bienvenido!"
    }), function(req, res){
});

//Register
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", middleware.confirmPassword, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                user.name       = req.body.name;
                user.lastname   = req.body.lastname;
                user.image      = "http://en.upside-art.com/images/empty_profile.png?w=150&h=150";
                user.save();
                req.flash("success", "¡Bienvenido!");
                res.redirect("/works");
            });
        }
    });
});

//Logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;