var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
    Message = require('../models/message'),
    Work    = require('../models/work'),
    middleware  = require('../middleware');

//Works
router.get("/works", function(req, res){
    Work.find({}).limit(5).sort({"_id": -1}).exec(function(err, allWorks){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            var worksPerPage = 5;
            var n = Math.ceil(allWorks.length/worksPerPage);
            res.render("works/index", {works: allWorks, n: n});
        }
    });
});

router.get("/worksearch", function(req, res){
    Work.find({}, function(err, foundWorks){
        if(err){
            req.flash("Ha ocurrido un problema");
            res.redirect("back");
        } else {
            foundWorks  = foundWorks.reverse();
            var result  = "";
            var n       = req.query.search;
            var worksPerPage = 5;
            var initial = (n - 1) * worksPerPage;
            var final   = initial + worksPerPage;
            foundWorks  = foundWorks.slice(initial, final);
            foundWorks.forEach(function(work){
                var str1 = '<div id="work-box" class="btn btn-grey work-box';
                if (work.status         === "En Curso") {
                    var str2 = ' on">';
                } else if (work.status  === "Completado") {
                    var str2 = ' done">';
                } else if (work.status  === "Abandonado") {
                    var str2 = ' off">';
                }
                result      = result.concat(str1.concat(str2));
                var str3    =   '<div class="col-xs-3" id="work-box-image">'
                                +   '<img class="thumbnail" src="' + work.thumbnail + '">'
                                +   '<div id="thumbnail-text">'
                                +       '<div class="col-xs-8" style="padding: 0px">'
                                +           '<a class="btn';
                if (work.status         === "En Curso") {
                    var str4    = ' btn-warning"></a>'; 
                } else if (work.status  === "Completado") {
                    var str4    = ' btn-success"></a>';
                } else if (work.status  === "Abandonado") {
                    var str4    = ' btn-danger"></a>';
                }
                result      = result.concat(str3.concat(str4));
                var str5    =               work.status
                                +           '<a href="/works/' + work._id + '" id="show-work" style="display:none"></a>'
                                +           '</div>'
                                +       '</div>'
                                +   '</div>'
                                +   '<div class="col-xs-9">'
                                +       '<h4>' + work.name + '</h4>'
                                +       '<hr>'
                                +       '<h5>' + work.description.substring(0, 500) + '</h5>'
                                +   '</div>'
                                +'</div>';
                result      = result.concat(str5);
            });
            res.send(result);
        }
    });
});

router.get("/works/new", middleware.isLoggedIn, function(req, res){
    res.render("works/new");
});

router.post("/works", middleware.isLoggedIn, function(req, res){
    var name        = req.body.title;
    var image       = "";
    if(req.body.image){
        image   = req.body.image;
    } else {
        image   = "https://d3lfzbr90tctqz.cloudfront.net/epi/resource/r/drone-dji-phantom-3-std-2.7k-cam-3-axis-gimbal-blanco/263355cd6dc7e030c2688b1f71b130e362c3fa4ae72525ff679aa83248a85e3d_350";
    }
    var description = req.body.description;
    var status      = "En Curso";
    var author      = req.user._id;
    var newWork = {name: name, thumbnail: image, description: description, status: status, author: author};
    Work.create(newWork, function(err, createdWork){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("/works");
        } else {
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    foundUser.works.push(createdWork);
                    foundUser.save();
                    req.flash("success", "¡Nuevo trabajo creado!");
                    res.redirect("/works");
                }
            });
        }
    });
});

router.delete("/works/:id", middleware.checkWorkOwner, function(req, res){
    Work.findById(req.params.id, function(err, foundWork){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("/works");
        } else {
            foundWork.remove(function(err){
                if(err){
                    console.log(err);
                    req.flash("error", "No se puede borrar este trabajo");
                    res.redirect("back");
                } else {
                    User.update(
                        {_id: foundWork.author},
                        {$pull: {works: foundWork._id}},
                        function(err){
                            if(err){
                                console.log(err);
                            }
                        }
                    );
                    User.update(
                        {_id: {$in: foundWork.collabs}},
                        {$pull: {works: foundWork._id}},
                        function(err, affected){
                            if(err){
                                console.log(err);
                            }
                        }
                    );
                    Message.find({_id: {$in: foundWork.messages}}, function(err, foundMessages){
                        if(err){
                            console.log(err);
                        } else {
                            foundMessages.forEach(function(message){
                                message.remove(function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            });
                        }
                    });
                    req.flash("success", "¡Trabajo eliminado!");
                    res.redirect("/works");
                }
            });
        }
    });
});

router.put("/works/:id", middleware.checkWorkOwner, function(req, res){
    Work.findByIdAndUpdate(req.params.id, req.body.work, function(err, updatedWork){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("/works");
        } else {
            if(req.body.workimage){
                updatedWork.images.push(req.body.workimage);
                updatedWork.save();
                req.flash("success", "¡Imagen añadida!<br>");
            }
            if(req.body.collabs){
                updatedWork.collabs.push(req.body.collabs);
                updatedWork.save();
                User.findById(req.body.collabs, function(err, foundUser){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    } else {
                        foundUser.works.push(updatedWork);
                        foundUser.save();
                        req.flash("success", "¡Usuario añadido!<br>");
                    }
                });
            }
            req.flash("success", "¡Trabajo editado!");
            res.redirect("/works/"+ updatedWork._id + "/edit");
        }
    });
});

router.get("/works/:id", function(req, res){
    Work.findById(req.params.id).populate("messages author collabs").exec(function(err, foundWork){
        if(err){
            console.log(err);
            req.flash("error", "Ha habido un problema");
            res.redirect("/works");
        } else {
            foundWork.messages = foundWork.messages.reverse();
            foundWork.save();
            res.render("works/show", {work: foundWork});
        }
    });
});

router.get("/works/:id/edit", middleware.checkWorkOwner, function(req, res){
    Work.findById(req.params.id).populate("author collabs").exec(function(err, foundWork){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("works/edit", {work: foundWork});
        }
    });
});

module.exports = router;