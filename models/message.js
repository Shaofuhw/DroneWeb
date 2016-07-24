var mongoose = require('mongoose');

var messagesSchema = mongoose.Schema({
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Message", messagesSchema);