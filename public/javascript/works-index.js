$(document).ready(function () {
    
    $.getJSON('/works/page/1', function(works) {
        var count = works[works.length-1];
        works.pop();
        printWorks(works);
        printPageButtons(count);
    });
    
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
    
    $('body').on('click', '.btn-group .btn-page', function(){
        $(".btn-group .btn").removeClass("active");
        $(this).addClass("active");
        $.getJSON('/works/page/'+$(this).val(), function(data) {
            data.pop();
            printWorks(data);
        });
    });
    
    $('body').on('click', '#previous-page', function(){
        var active  = $(".btn.active").val();
        if( active != 1 ){
            $('.btn.' + active).removeClass("active");
            $('.btn.' + (active - 1)).addClass("active");
            $.getJSON('/works/page/'+(active-1), function(data) {
                data.pop();
                printWorks(data);
            });
        }
    });
    
    $('body').on('click', '#next-page', function(){
        var active  = $(".btn.active").val();
        var n       = $(".btn.last").val();
        if( active != n ){
            $('.btn.' + active).next().addClass("active");
            $('.btn.' + active).removeClass("active");
            var route = '/works/page/'+$(".btn." + active).next().val()
            $.getJSON(route, function(data) {
                data.pop();
                printWorks(data);
            });
        }
    });
    
});

function printWorks (works){
    var result = "";
    works.forEach(function(work){
        result += '<div id="work-box" class="btn btn-grey work-box';
        if (work.status         === "En Curso") {
            result += ' on">';
        } else if (work.status  === "Completado") {
            result += ' done">';
        } else if (work.status  === "Abandonado") {
            result += ' off">';
        }
        result      +=   '<div class="col-xs-4" id="work-box-image">'
                        +   '<img class="thumbnail" src="' + work.thumbnail + '">'
                        +   '<div id="thumbnail-text">'
                        +       '<div class="col-xs-12" style="padding: 0px">'
                        +           '<a class="btn';
        if (work.status         === "En Curso") {
            result +=     ' btn-warning"></a>'; 
        } else if (work.status  === "Completado") {
            result +=     ' btn-success"></a>';
        } else if (work.status  === "Abandonado") {
            result +=     ' btn-danger"></a>';
        }
        result +=                   work.status
                        +           '<a href="/works/' + work._id + '" id="show-work" style="display:none"></a>'
                        +           '</div>'
                        +       '</div>'
                        +   '</div>'
                        +   '<div class="col-xs-8">'
                        +       '<h4>' + work.name + '</h4>'
                        +       '<hr>'
                        +       '<h5>' + work.description.substring(0, 500) + '</h5>'
                        +   '</div>'
                        +'</div>';
    });
    $('#works-list').html(result);
}

function printPageButtons(count) {
    var result  = "";
    var pages   = Math.ceil(count / 5);
    result      += '<div class="btn-group" role="group">';
    result      += '<button type="button" class="btn btn-default" id="previous-page"><</button>';
    for(var i = 1; i < pages+1; i++) {
        if(i == 1) {
            result  += '<button type="button" class="btn btn-default btn-page '+i+' active" value='+i+'>'+i+'</button>';
        } else if (i == pages){
            result  += '<button type="button" class="btn btn-default btn-page '+i+' last" value='+i+'>'+i+'</button>';
        } else {
            result  += '<button type="button" class="btn btn-default btn-page '+i+'" value='+i+'>'+i+'</button>';
        }
    }
    result      += '<button type="button" class="btn btn-default" id="next-page">></button></div>';
    $('#page-buttons').html(result);
    
}