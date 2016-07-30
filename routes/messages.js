var express = require('express'),
    router  = express.Router(),
    Message = require('../models/message'),
    Work    = require('../models/work'),
    middleware  = require('../middleware');

//Messages
router.post("/works/:id/messages", middleware.isLoggedIn, function(req, res){
    Work.findById(req.params.id, function(err, foundWork){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("back");
        } else {
            Message.create(req.body.message, function(err, message){
                if(err){
                    console.log(err);
                    req.flash("error", "Ha habido un problema");
                    res.redirect("back");
                } else {
                    message.author  = req.user._id;
                    message.save();
                    foundWork.messages.push(message);
                    foundWork.save();
                    req.flash("success", "¡Mensaje añadido!");
                    res.redirect("/works/" + foundWork._id);
                }
            });
        }
    });
});

router.delete("/works/:id/messages/:message_id", middleware.checkMessageOwner, function(req, res){
    Message.findById(req.params.message_id, function(err, foundMessage){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("back");
        } else {
            foundMessage.remove(function(err){
                if(err){
                    console.log(err);
                    req.flash("error", "Ha habido un problema");
                    res.redirect("back");
                } else {
                    Work.update(
                        {_id: req.params.id},
                        {$pull: {messages: foundMessage._id}}
                    );
                }
            });
            req.flash("success", "¡Mensaje borrado!");
            res.redirect("/works/" + req.params.id);
        }
    });
});

module.exports = router;