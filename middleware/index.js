var Message = require('../models/message'),
    Work    = require('../models/work'),
    User    = require('../models/user');
    
var middlewareObj = {};

middlewareObj.confirmPassword = function confirmPassword(req, res, next){
    if(req.body.password === req.body.cPassword){
        next();
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

middlewareObj.checkWorkOwner = function checkWorkOwner(req, res, next){
    if(req.isAuthenticated()){
        Work.findById(req.params.id, function(err, foundWork){
            if(err){
                res.redirect("back");
            } else {
                if(foundWork.author.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkMessageOwner = function checkMessageOwner(req, res, next){
    if(req.isAuthenticated()){
        Message.findById(req.params.message_id, function(err, foundMessage){
            if(err){
                res.redirect("back");
            } else {
                if(foundMessage.author.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkProfileOwner = function checkProfileOwner(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err){
                res.redirect("back");
            } else {
                if(foundUser._id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;