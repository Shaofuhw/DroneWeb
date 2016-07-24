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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    collabs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Work", workSchema);