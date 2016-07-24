$(document).ready(function () {
    
    $("#description-button").click(function(){
        $("#show-description").fadeIn(200);
        $("#show-authors").fadeOut(200);
        $("#show-images").fadeOut(200);
    });
    
    $("#authors-button").click(function(){
        $("#show-description").fadeOut(200);
        $("#show-authors").fadeIn(200);
        $("#show-images").fadeOut(200);
    });
    
    $("#images-button").click(function(){
        $("#show-description").fadeOut(200);
        $("#show-authors").fadeOut(200);
        $("#show-images").fadeIn(200);
    });
    
    $(".dropdown-toggle").click(function(){
        $(".dropdown-menu.list-group-item").fadeToggle(100);
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
    
    $('#author-search-button').click(function(){
        var parameters = {
            search: $('#author-search').val(),
            workid: $("#workid").val()
        };
        $.get('/profilesearch', parameters, function(data) {
            $('#author-results').html(data);
        });
    });
    
    $('#author-search').on('keyup', function(e){
        if(e.keyCode === 13) {
            var parameters = {
                search: $('#author-search').val(),
                workid: $("#workid").val(),
                workauthorid: $("#workauthorid").val()
            };
            $.get('/profilesearch', parameters, function(data) {
                $('#author-results').html(data);
            });
        }
        
    });
    
    /*$('#author-search').on('keyup', function(e){
        
            var parameters = {
                search: $(this).val()
            };
            $.get('/profilesearch', parameters, function(data) {
                $('#author-results').html(data);
            });
        }
    });*/
    
});

