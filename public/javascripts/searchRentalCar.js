$(document).ready(function () {
    var locations = JSON.parse($('#locations').text());
    console.log(locations);
    $('#locationPick').keyup(function () {
        $('#locationList').empty();
        var pick = $('#locationPick').val().toLowerCase();
        $.each(locations, function (key, location) {
            if (location.name_th.toLowerCase().indexOf(pick) >= 0 || location.name_eng.toLowerCase().indexOf(pick) >= 0 ||
                location.city_th.toLowerCase().indexOf(pick) >= 0 || location.city_th.toLowerCase().indexOf(pick) >= 0) {
                $('#locationList').append('<li class="list-group-item" data-value="' + location.name_th + '">' +
                    location.name_th + '</li>');
            }
        });
    });
    $("#locationList").on('click', 'li', function (e) {
        e.preventDefault();
        $('#locationPick').val($(this).attr('data-value'));
        console.log($('#locationPick').val());
        $('#locationList').empty();
    });
    jQuery('#startDate').datetimepicker({
        startDate: new Date(),
        minDate: 0
    });

    $('#startDate').change(function () {
        let tommorow = new Date($('#startDate').val()).getTime() + (24 * 60 * 60 * 1000);
        let endDateBegin = new Date(tommorow);
        console.log(endDateBegin);
        jQuery('#endDate').datetimepicker({
            startDate: endDateBegin,
            minDate: endDateBegin
        });
    })
});