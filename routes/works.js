var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
    Message = require('../models/message'),
    Work    = require('../models/work'),
    middleware  = require('../middleware');

//Works
router.get("/works", middleware.isLoggedIn, function(req, res){
    Work.find({}, function(err, allWorks){
        if(err){
            console.log(err);
        } else {
            res.render("works/index", {works: allWorks});
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
        } else {
            User.findById(req.user._id, function(err, foundUser){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    foundUser.works.push(createdWork);
                    foundUser.save();
                    res.redirect("/works");
                }
            });
        }
    });
});

router.delete("/works/:id", middleware.checkWorkOwner, function(req, res){
    Work.findById(req.params.id, function(err, foundWork){
        if(err){
            res.redirect("back");
        } else {
            foundWork.remove(function(err){
                if(err){
                    console.log(err);
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
            res.redirect("/works");
        } else {
            if(req.body.workimage){
                updatedWork.images.push(req.body.workimage);
                updatedWork.save();
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
                    }
                });
            }
            res.redirect("/works/"+ updatedWork._id + "/edit");
        }
    });
});

router.get("/works/:id", middleware.isLoggedIn, function(req, res){
    Work.findById(req.params.id).populate("messages author collabs").exec(function(err, foundWork){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
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