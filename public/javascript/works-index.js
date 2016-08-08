$(document).ready(function () {
    
    $("#all-button").click(function(){
        $(".work-box").fadeIn(200);
    });
    
    $("#on-button").click(function(){
        $(".work-box.on").fadeIn(200);
        $(".work-box.off").fadeOut(200);
        $(".work-box.done").fadeOut(200);
    });
    
    $("#off-button").click(function(){
        $(".work-box.off").fadeIn(200);
        $(".work-box.on").fadeOut(200);
        $(".work-box.done").fadeOut(200);
    });
    
    $("#done-button").click(function(){
        $(".work-box.done").fadeIn(200);
        $(".work-box.on").fadeOut(200);
        $(".work-box.off").fadeOut(200);
    });
    
    $(".work-box").click(function(){
        window.location = $(this).find("#show-work").attr("href");
    });
});