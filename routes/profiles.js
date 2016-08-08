var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
    middleware  = require('../middleware');
    
//Profiles

router.get("/profiles", middleware.isLoggedIn, function(req, res){
    User.find({}, function(err, foundUsers){
        if(err){
            req.flash("error", "Ha ocurrido un problema");
            res.redirect("/works");
        } else {
            sortOn(foundUsers, "name");
            res.render("profiles/index", {users: foundUsers});
        }
    });
});

router.get("/profiles/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("works").exec(function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("profiles/show", {user: foundUser});
        }
    });
});

router.get("/profiles/:id/edit", middleware.checkProfileOwner, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("profiles/edit", {user: foundUser});
        }
    });
});

router.put("/profiles/:id", middleware.checkProfileOwner, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("back");
        } else {
            if(!updatedUser.image) {
                updatedUser.image = "http://en.upside-art.com/images/empty_profile.png?w=150&h=150";
                updatedUser.save();
            }
            req.flash("success", "¡Perfil editado!");
            res.redirect("/profiles/"+ updatedUser._id);
        }
    });
});

router.get("/profilesearch", middleware.isLoggedIn, function(req, res){
    var name = req.query.search;
    User.find({"lowername": name.toLowerCase()}, function(err, foundUsers){
        if(err){
            console.log(err);
            res.send("Hubo un problema");
        } else {
            if(foundUsers.length == 0) {
                res.send("Usuario no encontrado");
            } else {
                if (req.query.workid){
                    var result = "";
                    foundUsers.forEach(function(user){
                        var coincide = 0;
                        user.works.forEach(function(work){
                            if(work == req.query.workid){
                                coincide = 1;
                            }
                        });
                        if(coincide == 0 && user.validated){
                            var str = '<form action="/works/' + req.query.workid + '?_method=PUT" method="POST"><h5><img src='
                                    + user.image +' class="img-circle"><a href="/profiles/' + user._id + '">' 
                                    + user.name + ' ' + user.lastname
                                    + '</a><input name="collabs" style="display: none" value="'
                                    + user._id + '"></h5><button class="btn btn-success btn-sm" style="margin-left: 10px">Añadir</button></form>';
                            result = result.concat(str);
                        }
                    });
                } else {
                    var result = "";
                    foundUsers.forEach(function(user){
                        if(user.validated){
                            var str = '<h4><img src='
                                + user.image +' class="img-circle"><i class="glyphicon glyphicon-small glyphicon-chevron-right"></i>'
                                + '<a href="/profiles/' + user._id + '">' 
                                + user.name + ' ' + user.lastname
                                + '</a><input name="collabs" style="display: none" value="'
                                + user._id + '"></h4>';
                            result = result.concat(str);
                        }
                    });
                }
                res.send(result);
            }
        }
    });
});

module.exports = router;

function sortOn (arr, prop) {
    arr.sort (
        function (a, b) {
            if (a[prop].toLowerCase() < b[prop].toLowerCase()){
                return -1;
            } else if (a[prop].toLowerCase() > b[prop].toLowerCase()){
                return 1;
            } else {
                return 0;   
            }
        }
    );
}