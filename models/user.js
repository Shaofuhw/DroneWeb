var mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose');

var userSchema  = new mongoose.Schema({
        name:       String,
        password:   String,
        username:   String,  //Email
        lastname:   String,
        image:      String,
        works: [{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Work"
            },
            name: String
        }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);