$(document).ready(function () {

    $(".user-box").click(function(){
        window.location = $(this).find("#show-profile").attr("href");
    });
    
    $('#profile-search').on('keyup', function(e){
        if(e.keyCode === 13) {
            var parameters = {
                search: $('#profile-search').val(),
            };
            $.get('/profilesearch', parameters, function(data) {
                $('#profile-results').html(data);
            });
        }
    });
});