/*
*	Cervelo
*	Author Adam Phin
*   Copyright © 2011 Cervelo
*   All rights reserved.
*	Reactive.com
*/

var $LTIE9 = false, $isIPad = false, $isIPhone = false, $isAutoScrolling = false;

var cervelo = {
    preinit: function () {
        $isIPad = $('html').hasClass('ipad');
        $isIPhone = $('html').hasClass('iphone');
        // Detect is less than IE9
        if ($.browser.msie && $.browser.version < 9) $LTIE9 = true;
    },
    init: function () {
        cervelo.cufon.init();
        cervelo.preinit();
        $(document).ready(function () {
            cervelo.cufon.ready();
            cervelo.form.init();
            cervelo.navigation.init();
            cervelo.filter.init();
            cervelo.hotspots.init();
            cervelo.slideshow.init($('.P5'));
            cervelo.initialScroll.init();
            cervelo.scrollToTop.init();

            if ('ontouchstart' in document) {
                $('body').removeClass('no-touch');
            }

            if ($isIPad || $isIPhone) {
                window.addEventListener('orientationchange', updateOrientation, false);
                $(".videoPlayer iframe").each(function() {
                    $(this).attr('src', $(this).attr('src').replace('&modestbranding=1', ''));
                });
            }

            function updateOrientation() {
                if ($isIPad) {
                    $('footer').css({ 'bottom': -$('footer').height() + 88 + 'px' });
                }
                Cufon.refresh();
            }

            $('footer').hover(function () {
                $('.agencyButton').fadeIn(100);
            }, function () {
                $('.agencyButton').fadeOut(100);
            });

        });
    },

    cufon: {
        init: function () {
            Cufon.replace('h1:not(.nocufon), h2:not(.nocufon), h3:not(.nocufon), h4:not(.nocufon), p:not(.nocufon), .textField, .switch, .submitButton .title');
            Cufon.replace('#scrollToTop a', { fontFamily: 'Avenir', hover: true });
            Cufon.replace('#nav a', { fontFamily: 'Avenir', hover: true });
        },
        ready: function () {
            Cufon.now();
        }
    },

    initialScroll: {
        init: function () {
            setTimeout(function () {
                var offset = 0, $scrollToMe = $('.scrollToMe:last');
                $('#nav .active').removeClass('active');
                $('#nav a').eq($scrollToMe.index()).addClass('active');
                Cufon.refresh("#nav a");
                if (!$isIPad && !$isIPhone) { offset = -60; }
                $isAutoScrolling = true;
                $.scrollTo($scrollToMe, 2000, { offset: offset, easing: 'easeInOutQuart', onAfter: function () { $isAutoScrolling = false; } });
            }, 1000);
        }
    },

    scrollToTop: {
        init: function () {
            if ($isIPad || $isIPhone) return;
            var open = false;
            $(window).scroll(function () {
                var distanceTop = $('#panel3').offset().top - $(window).height();
                if ($(window).scrollTop() > distanceTop) {
                    if (!open) {
                        open = true;
                        $('#scrollToTop').animate({ 'right': 0 }, 500);
                    }
                } else {
                    open = false;
                    $('#scrollToTop').animate({ 'right': -90 }, 500);
                }
            });
            $('#scrollToTop a').click(function (e) {
                e.preventDefault();
                $('#nav .active').removeClass('active');
                $('#nav a:first').addClass('active');
                Cufon.refresh("#nav a");
                $isAutoScrolling = true;
                $.scrollTo($('#panels'), 2000, { easing: 'easeInOutQuart', onAfter: function () { $isAutoScrolling = false; } });
            });
        }
    },

    hotspots: {
        init: function () {
            if ($isIPad || $isIPhone) {
                $('.hotspot').bind("touchstart", function (e) {
                    e.preventDefault();
                    $('.hotspot .detail').hide().css({ 'z-index': '1' });
                    $('.detail', $(this)).stop().css({ 'z-index': '2' }).fadeIn(400, 'easeInOutQuart').delay(4000).fadeOut(400, 'easeInOutQuart');
                });
            } else {
                $('.hotspot').hover(function () {
                    $('.detail', $(this)).fadeIn(400, 'easeInOutQuart');
                }, function () {
                    $('.detail', $(this)).fadeOut(400, 'easeInOutQuart');
                });
            }
        }
    },

    navigation: {
        init: function () {
            if ($isIPad || $isIPhone) return;

            $('#logo a').bind('click', function (e) {
                e.preventDefault();
                $isAutoScrolling = true;
                $.scrollTo($(this).attr('href'), 1000, { offset: -57, easing: 'easeInOutQuart', onAfter: function () { $isAutoScrolling = false; } });
            });

            $('#nav a:not(".fullSpecs")').bind('click', function (e) {
                e.preventDefault();
                $('#nav .active').removeClass('active');
                $(this).addClass('active');
                $isAutoScrolling = true;
                $.scrollTo($(this).attr('href'), 1000, { offset: -57, easing: 'easeInOutQuart', onAfter: function () { $isAutoScrolling = false; } });
                Cufon.refresh("#nav a");
            });

            $("#panels > div").bind('inview', function (event, isInView, visiblePartX, visiblePartY) {
                if ($isAutoScrolling) return;
                if (isInView && visiblePartY === 'top') {
                    $('#nav .active').removeClass('active');
                    $('#nav a').eq($(this).index()).addClass('active');
                    Cufon.refresh("#nav a");
                }
            });
        }
    },

    filter: {
        init: function () {
            $('.filter li').hover(function () {
                $('.image .holder', this).stop().animate({ 'top': -110 }, { duration: 300, easing: 'easeOutQuart' });
            }, function () {
                $('.image .holder', this).stop().animate({ 'top': 0 }, { duration: 300, easing: 'easeOutQuart' });
            });

            $('.switch').bind('click', function (e) {
                var radioGroup = $('input', this).attr('name');
                $("input[name='" + radioGroup + "']").parent().removeClass('checked').addClass('unchecked');
                $("input[name='" + radioGroup + "']").attr({ checked: false });
                $(this).removeClass('unchecked').addClass('checked');
                $("input", this).attr({ checked: true });

                cervelo.filter.updateFilter($(this).parent().attr('id'), $("input", this).val());
            });

            var interval = setInterval("cervelo.filter.changeFilter()", 10000);
            $('.filter').hover(function () {
                clearInterval(interval);
            }, function () {
                interval = setInterval("cervelo.filter.changeFilter()", 10000);
            });
        },

        changeFilter: function () {
            $('.switch.unchecked').click();
        },

        updateFilter: function (parent, filter) {
            parent = '#' + parent + 'Items';
            var list = $(parent + ' ul ');
            if (filter == 'faster') {
                list.stop().animate({ 'left': -903 }, { duration: 1000, easing: 'easeOutQuart' });
            } else {
                list.stop().animate({ 'left': 0 }, { duration: 1000, easing: 'easeOutQuart' });
            }
            return;
        }
    },

    slideshow: {
        init: function (slideshowID) {

            var i = 0;
            var slideshowObj = new Object();
            slideshowObj.slideshow = slideshowID;
            slideshowObj.currentPage = 0;
            slideshowObj.totalPages = 0;
            slideshowObj.carousel = $(' > ul', slideshowID);
            slideshowObj.itemWidth = $('li', slideshowObj.carousel).width();

            var $startButton = $('.startButton'),
                $stopButton = $('.stopButton');

            $startButton.bind('click', function () {
                cervelo.slideshow.start();
                $startButton.fadeOut(80, 'easeOutCubic');
                $stopButton.delay(80).fadeIn(80, 'easeOutCubic');
            });

            $stopButton.bind('click', function () {
                cervelo.slideshow.stop();
                $stopButton.fadeOut(80, 'easeOutCubic');
                $startButton.delay(80).fadeIn(80, 'easeOutCubic');
            });

            // Setup Slides
            $('li', slideshowObj.slideshow).each(function () {
                i++;
                $(this).addClass("p" + i);
                $(".nav").append('<li>' + i + '</li>');
            });

            slideshowObj.totalPages = i;
            slideshowObj.carousel.css({ 'width': ((slideshowObj.totalPages + 1) * slideshowObj.itemWidth) + 'px' });

            // Set Thumbnail Click Event
            $(".nav li").each(function () {
                $(this).click(function (e) {
                    clearTimeout(window.slideTimer);
                    slideshowObj.currentPage = $(this).index();
                    cervelo.slideshow.changeSlide(slideshowObj.currentPage);
                });
            });

            // Select First Thumbnail
            cervelo.slideshow.highlightThumb(0);

            window.slideshowObj = slideshowObj;
            window.slideTimer = setTimeout(function () { cervelo.slideshow.autoSlide(); }, 5000);
        },

        autoSlide: function () {
            clearTimeout(window.slideTimer);
            window.slideshowObj.currentPage++;
            if (window.slideshowObj.currentPage >= window.slideshowObj.totalPages) window.slideshowObj.currentPage = 0;
            cervelo.slideshow.changeSlide(window.slideshowObj.currentPage);
        },

        changeSlide: function (slideNum) {
            var xPos = -(slideNum * window.slideshowObj.itemWidth);
            slideshowObj.carousel.animate({ left: xPos }, { duration: 600, easing: 'easeInOutQuad' });
            cervelo.slideshow.highlightThumb(window.slideshowObj.currentPage);
            window.slideTimer = setTimeout(function () { cervelo.slideshow.autoSlide(); }, 5000);
        },

        highlightThumb: function (thumbNumber) {
            $(".nav li").each(function () {
                if ($(this).index() == thumbNumber) $(this).addClass("on");
                else $(this).removeClass("on");
            });
        },
        stop: function () {
            clearTimeout(window.slideTimer);
        },
        start: function () {
            autoSlide();
        }
    },

    form: {
        init: function () {
            $.FormedPlaceHolders();

            $('#submitEmail').click(function (e) {
                e.preventDefault();
                $('.errorText').css({ 'display': 'none' });
                $('.submitButton .title').css({ 'display': 'none' });
                $('.submitLoader').css({ 'display': 'inline-block' });

                if (!cervelo.form.validateEmail($('#emailAddress').val())) {
                    $('#emailAddress').val('Please try again');
                    $('.submitButton .title').delay(100).css({ 'display': 'inline' });
                    $('.submitLoader').delay(100).css({ 'display': 'none' });
                    return;
                }

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: "WebService.asmx/SaveEmail",
                    data: '{ email: "' + $('#emailAddress').val() + '" }',
                    dataType: "json",
                    success: function (msg) {
                        switch (msg.d) {
                            case 'success':
                                $('footer form').fadeOut(100);
                                $('footer h3').append('<b>We will email you soon<b>');
                                Cufon.refresh();
                                $('footer h3 b').delay(200).fadeIn(200);
                                break;

                            case 'fail':
                                $('#emailAddress').val('Please try again');

                                break;
                        }
                        $('.submitButton .title').delay(100).css({ 'display': 'inline' });
                        $('.submitLoader').delay(100).css({ 'display': 'none' });
                    }
                });
            });
        },
        validateEmail: function (elementValue) {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailPattern.test(elementValue);
        }
    }
};
cervelo.init();