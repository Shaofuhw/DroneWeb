var mongoose = require('mongoose');

var workSchema = new mongoose.Schema({
    name: String,
    thumbnail: String,
    description: String,
    status: String,
    images: [ String ],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    }
});

module.exports = mongoose.model("Work", workSchema);