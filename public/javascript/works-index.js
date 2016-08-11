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
    
    $('body').on('click', '.work-box', function() {
        window.location = $(this).find("#show-work").attr("href");
    });
    
    $.get('/worksearch', {search: 1}, function(data) {
        $('#works-list').html(data);
    });
    
    $(".btn-group .btn-page").click(function(){
        $(".btn-group .btn").removeClass("active");
        $(this).addClass("active");
        $.get('/worksearch', {search: $(this).val()}, function(data) {
            $('#works-list').html(data);
        });
    });
    
    $("#previous-page").click(function(){
        var active  = $(".btn.active").val();
        if( active != 1 ){
            $('.btn.' + active).removeClass("active");
            $('.btn.' + (active - 1)).addClass("active");
            $.get('/worksearch', {search: (active - 1)}, function(data) {
                $('#works-list').html(data);
            });
        }
    });
    
    $("#next-page").click(function(){
        var active  = $(".btn.active").val();
        var n       = $(".btn.last").val();
        if( active != n ){
            $('.btn.' + active).next().addClass("active");
            $('.btn.' + active).removeClass("active");
            $.get('/worksearch', {search: $(".btn." + active).next().val()}, function(data) {
                $('#works-list').html(data);
            });
        }
    });
    
});