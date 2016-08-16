var express     = require('express'),
    passport    = require('passport'),
    router      = express.Router(),
    User        = require('../models/user'),
    nodemailer  = require('nodemailer'),
    middleware  = require('../middleware');

//NodeMailer
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'droneunex@gmail.com', // Your email id
            pass: 'droneunexpass' // Your password
        }
    });

//Home
router.get("/", function(req, res){
    res.render("home");
});

//Login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", middleware.isValidated, passport.authenticate("local", {
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
            req.flash("error", "Correo ya utilizado");
            res.redirect("/register");
        } else {
            user.name       = req.body.name;
            user.lastname   = req.body.lastname;
            user.image      = "https://i.imgur.com/VeE8hZo.png";
            user.validated  = false;
            user.save();
            var mailOptions = {
                from: '"DroneUnex" <droneunex@gmail.com>', // sender address 
                to: user.username, // list of receivers 
                subject: 'DroneUNEX. Confirmación de correo', // Subject line 
                html: '¡Bienvenido!<br> Por favor haz click en el siguiente enlace para confirmar tu cuenta:<br><br>'
                    //+ 'https://webdevcourse-mrfu.c9users.io/validate/' + user._id
                    + 'https://droneweb.herokuapp.com/validate/' + user._id
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    res.redirect("back");
                }
                req.flash("error", "Por favor confime su correo electrónico");
                res.redirect("/login");
            });
        }
    });
});

//Logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//Validate
router.get("/validate/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Ha ocurrido un problema");
            res.redirect("/login");
        } else {
            if(foundUser.validated){
                req.flash("error", "La cuenta ya está verificada");
            } else {
                foundUser.validated = true;
                foundUser.save();
                req.flash("success", "¡Cuenta verificada con éxito!");
            }
            res.redirect("/login");
        }
    });
});

router.get("/validate/:id/:email", function(req, res){
    var mailOptions = {
        from: '"DroneUnex" <droneunex@gmail.com>', // sender address 
        to: req.params.email, // list of receivers 
        subject: 'DroneUNEX. Confirmación de correo', // Subject line 
        html: '¡Bienvenido!<br> Por favor haz click en el siguiente enlace para confirmar tu cuenta:<br><br>'
            + 'https://webdevcourse-mrfu.c9users.io/validate/' + req.params.id
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            req.flash("error", "Ha ocurrido un problema");
            res.redirect("back");
        }
        req.flash("success", "Correo de confirmación enviado");
        res.redirect("/login");
    });
});

module.exports = router;