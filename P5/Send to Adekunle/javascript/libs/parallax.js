/*
Author: Ian Lunn
Author URL: http://www.ianlunn.co.uk/
*/

$(document).ready(function () {
    return;
    var $window = $(window);
    var $firstBG = $('#intro');
    var $secondBG = $('#second');
    var bg1 = $("#second .bg1");
    var bg2 = $("#second .bg2");
    var bg3 = $("#second .bg3");
    var bg4 = $("#second .bg4");
    var bg5 = $("#second .bg5");
    var bg6 = $("#second .bg6");
    var bg7 = $("#second .bg7");

    if (navigator.userAgent.toLowerCase().indexOf('ipad') != -1) {
        bg1.css({ 'backgroundPosition': '-89% 194px' });
        bg2.css({ 'backgroundPosition': '-5% -103px' });
        bg3.css({ 'backgroundPosition': '30% -20px' });
        bg4.css({ 'backgroundPosition': '50% -70px' });
        bg5.css({ 'backgroundPosition': '70% -23px' });
        bg6.css({ 'backgroundPosition': '107% -23px' });
        bg7.css({ 'backgroundPosition': '100% 300px' });
        return;
    }
    var windowHeight = $window.height(); //get the height of the window


    //apply the class "inview" to a section that is in the viewport
    $('#intro, #second').bind('inview', function (event, visible) {
        if (visible == true) {
            $(this).addClass("inview");
        } else {
            $(this).removeClass("inview");
        }
        cervelo.navigation.update();
    });

    //function that is called for every pixel the user scrolls. Determines the position of the background
    /*arguments: 
    x = horizontal position of background
    windowHeight = height of the viewport
    pos = position of the scrollbar
    adjuster = adjust the position of the background
    inertia = how fast the background moves in relation to scrolling
    */
    function newPos(x, windowHeight, pos, adjuster, inertia) {
        return x + "% " + (-((windowHeight + pos) - adjuster) * inertia) + "px";
    }

    function itemNewPos(windowHeight, pos, adjuster, inertia) {
        return (-((windowHeight + pos) - adjuster) * inertia);
    }

    //function to be called whenever the window is scrolled or resized
    function Move() {
        var pos = $window.scrollTop();

        if ($firstBG.hasClass("inview")) {
            //$firstBG.css({ 'backgroundPosition': newPos(50, windowHeight, pos, 800, 0.3) });
        }

        if ($secondBG.hasClass("inview")) {
            //$secondBG.css({ 'backgroundPosition': newPos(50, windowHeight, pos, 1250, 0.3) });

            //bg1.css({ 'backgroundPosition': newPos(-8, windowHeight, pos, 2750, 0.2) });
            //bg2.css({ 'backgroundPosition': newPos(-5, windowHeight, pos, 1650, 0.8) });
            //bg3.css({ 'backgroundPosition': newPos(30, windowHeight, pos, 1750, 0.7) });
            //bg4.css({ 'backgroundPosition': newPos(50, windowHeight, pos, 1650, 0.55) });
            //bg5.css({ 'backgroundPosition': newPos(70, windowHeight, pos, 1750, 0.8) });
            //bg6.css({ 'backgroundPosition': newPos(107, windowHeight, pos, 1750, 0.8) });
            //bg7.css({ 'backgroundPosition': newPos(100, windowHeight, pos, 2780, 0.3) });

        }
    }

    $window.resize(function () {
        Move();
    });

    $window.bind('scroll', function () {
        Move();
    });

});