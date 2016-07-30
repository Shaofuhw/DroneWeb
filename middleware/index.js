var Message = require('../models/message'),
    Work    = require('../models/work'),
    User    = require('../models/user');
    
var middlewareObj = {};

middlewareObj.confirmPassword = function confirmPassword(req, res, next){
    if(req.body.password === req.body.cPassword){
        next();
    } else {
        req.flash("error", "Las contraseñas no coinciden");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Por favor introduzca sus datos");
        res.redirect("/login");
    }
};

middlewareObj.checkWorkOwner = function checkWorkOwner(req, res, next){
    if(req.isAuthenticated()){
        Work.findById(req.params.id, function(err, foundWork){
            if(err){
                req.flash("error", "No se ha encontrado");
                res.redirect("back");
            } else {
                if(foundWork.author.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "No tienes los permisos necesarios");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Por favor introduzca sus datos");
        res.redirect("/login");
    }
};

middlewareObj.checkMessageOwner = function checkMessageOwner(req, res, next){
    if(req.isAuthenticated()){
        Message.findById(req.params.message_id, function(err, foundMessage){
            if(err){
                req.flash("error", "No se ha encontrado");
                res.redirect("back");
            } else {
                if(foundMessage.author.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "No tienes los permisos necesarios");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Por favor introduzca sus datos");
        res.redirect("back");
    }
};

middlewareObj.checkProfileOwner = function checkProfileOwner(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err){
                req.flash("error", "No se ha encontrado");
                res.redirect("back");
            } else {
                if(foundUser._id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "No tienes los permisos necesarios");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Por favor introduzca sus datos");
        res.redirect("back");
    }
};

module.exports = middlewareObj;