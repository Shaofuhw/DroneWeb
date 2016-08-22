//=============Setup
var express     = require('express'),
    app         = express(),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    passport    = require('passport'),
    localStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    flash       = require('connect-flash'),
    
    User    = require('./models/user'),

    indexRoutes     = require('./routes/index'),
    profileRoutes   = require('./routes/profiles'),
    workRoutes      = require('./routes/works'),
    messageRoutes   = require('./routes/messages');

//mongoose.connect("mongodb://localhost/drone_web");
mongoose.connect(process.env.DATABASEURL);
    
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
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

////=============Routes

app.use(indexRoutes);
app.use(profileRoutes);
app.use(workRoutes);
app.use(messageRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
})