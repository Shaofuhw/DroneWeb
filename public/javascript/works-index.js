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
    
    $("#on-status").click(function(){
        $("#on-form").submit();
    });
    
    $("#done-status").click(function(){
        $("#done-form").submit();
    });
    
    $("#off-status").click(function(){
        $("#off-form").submit();
    });
    
    $(".work-box").click(function(){
        window.location = $(this).find("#edit-href").attr("href");
    });
});