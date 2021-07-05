setTimeout(() => {
    location.reload();
}, 30000);

$(function () {
    $('[data-toggle="popover"]').popover();

    $("#radar-wrap").on('click', function () {
        if ($("#radar-wrap").hasClass("radar-close")) {
            $("#radar-wrap").removeClass("radar-close");
            $("#radar-wrap").addClass("radar-wide");
        } else {
            $("#radar-wrap").addClass("radar-close");
            $("#radar-wrap").removeClass("radar-wide");
        }
    });
});
