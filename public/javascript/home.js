$(document).ready(function () {
    function initMap() {
        var mapDiv = document.getElementById('googleMap');
        var map = new google.maps.Map(mapDiv, {
            center: {lat: 38.883904, lng: -7.003887},
            zoom: 15
        });
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(38.883904, -7.003887),
            map: map
        });
    }
    initMap();
    
    $("#nav-home").click(function() {
        $('html, body').animate({
            scrollTop: $("#home-body").offset().top
        }, 1000);
    });
    
    $("#nav-info").click(function() {
        $('html, body').animate({
            scrollTop: $("#home-description").offset().top
        }, 1000);
    });
    
    $("#nav-contact").click(function() {
        $('html, body').animate({
            scrollTop: $("#home-contact").offset().top
        }, 1000);
    });
    
    $("#hidden-toggle").click(function(){
        // 
        $("#hidden-toggle").fadeOut(300, function(){
            $("#hidden-login").show("fade");
        });
    });
});