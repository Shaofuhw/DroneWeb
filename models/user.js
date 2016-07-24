var mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');

var userSchema  = new mongoose.Schema({
        name:       String,
        password:   String,
        username:   String,  //Email
        lastname:   String,
        image:      String,
        works: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Work"
            }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);