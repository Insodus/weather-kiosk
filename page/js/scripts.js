setTimeout(() => {
    location.reload();
}, 30000);

$(function () {
    $('[data-toggle="popover"]').popover();

    $("#radar-wrap").on('click', function () {
        if ($("#radar-wrap").hasClass("radar-image")) {
            $("#radar-wrap").addClass("radar-frame");
            $("#radar-wrap").removeClass("radar-image");
            $("#radar-image").hide();
            $("#radar-frame").show();
            $("#radar-frame").attr('src', 'https://lakemonster.com/lake/NH/Lake-Sunapee-3141');
        } else {
            $("#radar-wrap").addClass("radar-image");
            $("#radar-wrap").removeClass("radar-frame");
            $("#radar-image").show();
            $("#radar-frame").hide();
            $("#radar-frame").attr('src', '');
        }
    });
});
