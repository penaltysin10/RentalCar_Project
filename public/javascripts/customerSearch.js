$(document).ready(function () {
    $('a.btn').click(function () {
        var url = $(this).attr('href');
        var newUrl = url + '&locationPick=' + $('#locationPick').val() + '&startDate=' +
            $('#startDate').val() + '&endDate=' + $('#endDate').val();
        console.log(url);
        $(this).attr('href', newUrl);
    })
});