//=============Setup
var express     = require('express'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    passport    = require('passport'),
    flash       = require('connect-flash'),
    localStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    
    app         = express(),
    
    User    = require('./models/user'),
    Work    = require('./models/work'),
    Message = require('./models/message');
    
mongoose.connect("mongodb://localhost/drone_web");
    
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

////=============Passport
app.use(require('express-session')({
    secret: "SecretCodeDroneWeb",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////=============Middleware
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.url          = req.url;
    next();
});

////=============Routes
//Home
app.get("/", function(req, res){
    res.render("home");
});

//Login
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/works",
    failureRedirect: "/login"
    }), function(req, res){
});

//Register
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", confirmPassword, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                user.name       = req.body.name;
                user.lastname   = req.body.lastname;
                user.image      = "http://en.upside-art.com/images/empty_profile.png?w=150&h=150"
                user.save();
                res.redirect("/works");
            });
        }
    });
});

//Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//Works
app.get("/works", isLoggedIn, function(req, res){
    Work.find({}, function(err, allWorks){
        if(err){
            console.log(err);
        } else {
            res.render("works/index", {works: allWorks});
        }
    });
});

app.get("/works/new", isLoggedIn, function(req, res){
    res.render("works/new");
});

app.post("/works", isLoggedIn, function(req, res){
    var name        = req.body.title;
    if(req.body.image){
        var image   = req.body.image;
    } else {
        var image   = "https://d3lfzbr90tctqz.cloudfront.net/epi/resource/r/drone-dji-phantom-3-std-2.7k-cam-3-axis-gimbal-blanco/263355cd6dc7e030c2688b1f71b130e362c3fa4ae72525ff679aa83248a85e3d_350";
    }
    var description = req.body.description;
    var status      = "En Curso";
    var author      = {
        id: req.user._id,
        name: req.user.name
    };
    var newWork = {name: name, thumbnail: image, description: description, status: status, author: author};
    Work.create(newWork, function(err, createdWork){
        if(err){
            console.log(err);
        } else {
            User.findById(createdWork.author.id, function(err, foundUser){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    var work = {
                        id      : createdWork._id,
                        name    : createdWork.name
                    };
                    foundUser.works.push(work);
                    foundUser.save();
                    res.redirect("/works");
                }
            });
        }
    });
});

//TODO - REMOVE USER LIST OF WORKS
app.delete("/works/:id", checkWorkOwner, function(req, res){
    Work.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/works");
        } else {
            res.redirect("/works");
        }
    });
});

app.put("/works/:id", isLoggedIn, function(req, res){
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
                User.findById(req.body.collabs.id, function(err, foundUser){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    } else {
                        var work = {
                            id      : updatedWork._id,
                            name    : updatedWork.name
                        };
                        foundUser.works.push(work);
                        foundUser.save();
                    }
                });
            }
            res.redirect("/works/"+ updatedWork._id + "/edit");
        }
    });
});

app.get("/works/:id", isLoggedIn, function(req, res){
    Work.findById(req.params.id).populate("messages author.id collabs.id").exec(function(err, foundWork){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("works/show", {work: foundWork});
        }
    });
});

app.get("/works/:id/edit", isLoggedIn, function(req, res){
    Work.findById(req.params.id).populate("author.id").exec(function(err, foundWork){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("works/edit", {work: foundWork});
        }
    });
});

//Messages

app.post("/works/:id/messages", isLoggedIn, function(req, res){
    Work.findById(req.params.id, function(err, foundWork){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            Message.create(req.body.message, function(err, message){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    message.author.id   = req.user._id;
                    message.author.name = req.user.name;
                    message.save();
                    foundWork.messages.push(message);
                    foundWork.save();
                    res.redirect("/works/" + foundWork._id);
                }
            });
        }
    });
});

app.delete("/works/:id/messages/:message_id", function(req, res){
    Message.findByIdAndRemove(req.params.message_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/works/" + req.params.id);
        }
    });
});

//Profiles

app.get("/profiles/:id", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("profiles/show", {user: foundUser});
        }
    });
});

app.get("/profiles/:id/edit", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("profiles/edit", {user: foundUser});
        }
    });
});

app.put("/profiles/:id", isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            if(!updatedUser.image) {
                updatedUser.image = "http://en.upside-art.com/images/empty_profile.png?w=150&h=150";
                updatedUser.save();
            }
            res.redirect("/profiles/"+ updatedUser._id);
        }
    });
});

app.get("/profilesearch", function(req, res){
    var name = req.query.search;
    User.find({"name": name}, function(err, foundUsers){
        if(err){
            console.log(err);
            res.send("Hubo un problema");
        } else {
            if(foundUsers.length == 0) {
                res.send("Usuario no encontrado");
            } else {
                var result = "";
                foundUsers.forEach(function(user){
                    var coincide = 0;
                    user.works.forEach(function(work){
                        if(work.id == req.query.workid){
                            coincide = 1;
                        }
                    });
                    if(coincide == 0){
                        var str = '<form action="/works/' + req.query.workid + '?_method=PUT" method="POST"><h5><img src='
                                + user.image +' class="img-circle"><a href="/profiles/' + user._id + '">' 
                                + user.name + ' ' + user.lastname
                                + '</a><input name="collabs[id]" style="display: none" value="'
                                + user._id + '"><input name="collabs[name]" style="display:none" value="'
                                + user.name + '"></h5><button class="btn btn-success btn-sm" style="margin-left: 10px">Añadir</button></form>';
                        result = result.concat(str);
                    }
                });
                res.send(result);
            }
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});

function confirmPassword(req, res, next){
    if(req.body.password === req.body.cPassword){
        next();
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function checkWorkOwner(req, res, next){
    if(req.isAuthenticated()){
        Work.findById(req.params.id, function(err, foundWork){
            if(err){
                res.redirect("back");
            } else {
                if(foundWork.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}