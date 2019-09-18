$(document).ready(function () {

    $('#searchInvoice').click(function () {
        let newUrl = '';
        if ($('#invoiceNo').val() == '') {
            newUrl = $('.link-report').attr('href');
            $('#searchInvoice').attr('href', newUrl);
        } else {
            var url = $('#searchInvoice').attr('href');
            newUrl = url + $('#invoiceNo').val().trim();
            $('#searchInvoice').attr('href', newUrl);
        }
    });

    $('#rangeSearch').change(function () {
        location.href = $(this).val();
    })

    $('#printReport').click(function () {
        var divToPrint = $('#listReport');
        var html = '<!DOCTYPE html>' +
            '<html lang="en">' +
            '<head>' +
            '<meta charset="UTF-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<meta http-equiv="X-UA-Compatible" content="ie=edge">' +
            '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />' +
            '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.9.0/css/all.css" integrity="sha384-i1LQnF23gykqWXg6jxC2ZbCbUMxyw5gLZY6UiUS98LYV5unm8GWmfkIS6jqJfb4E" crossorigin="anonymous" />' +
            '<link rel="stylesheet" href="/public/stylesheets/companyReport.css">' +
            '<title>REPORT</title>' +
            '</head>' +
            '<body onload="window.print(); window.close();">' +
            divToPrint.html() +
            '</body>' +
            '</html>';
        var popupWin = window.open();
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();
    })
});