$(document).ready(function () {
    
    var previous    = document.referrer.replace(/^https?:\/\//, '').split('/');
    var current     = window.location.href.replace(/^https?:\/\//, '').split('/');
    
    if(previous[previous.length-1] === current[current.length-1]){
        $("#show-description").fadeOut(200);
        $("#show-authors").fadeOut(200);
        $("#show-images").fadeOut(200);
        $("#show-chat").fadeIn(200);
    }
    
    
    $("#description-button").click(function(){
        $("#show-description").fadeIn(200);
        $("#show-authors").fadeOut(200);
        $("#show-images").fadeOut(200);
        $("#show-chat").fadeOut(200);
    });
    
    $("#authors-button").click(function(){
        $("#show-description").fadeOut(200);
        $("#show-authors").fadeIn(200);
        $("#show-images").fadeOut(200);
        $("#show-chat").fadeOut(200);
    });
    
    $("#images-button").click(function(){
        $("#show-description").fadeOut(200);
        $("#show-authors").fadeOut(200);
        $("#show-images").fadeIn(200);
        $("#show-chat").fadeOut(200);
    });
    
    $("#chat-button").click(function(){
        $("#show-description").fadeOut(200);
        $("#show-authors").fadeOut(200);
        $("#show-images").fadeOut(200);
        $("#show-chat").fadeIn(200);
    });
    
});