$(document).ready(function() {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function() {
        toggle_overlay();
        $('#wrapper').toggleClass('toggled');
    });

    $('#page-content-wrapper').on('swipeleft', function(e) {
        toggle_overlay();
        $('#wrapper').toggleClass('toggled');
    });

    $('.overlay').on('click', function() {
        toggle_overlay();
        $('#wrapper').toggleClass('toggled');
    })

    function toggle_overlay() {
        if (isClosed) {
            $('html').css('overflow', 'auto');
            overlay.hide();
        } else {
            $('html').css('overflow', 'hidden');
            overlay.show();
        }
        isClosed = !isClosed;
    }
});
