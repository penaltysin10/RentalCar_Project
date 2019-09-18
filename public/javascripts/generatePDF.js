$(document).ready(function () {
    $('#download').on('click', function () {
        var divToPrint = document.getElementById('mainContent');
        var invoiceNumber = $('#invoiceNumber').val();
        var html = '<!DOCTYPE html>' +
            '<html lang="en">' +
            '<head>' +
            '<meta charset="UTF-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<meta http-equiv="X-UA-Compatible" content="ie=edge">' +
            '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />' +
            '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.9.0/css/all.css" integrity="sha384-i1LQnF23gykqWXg6jxC2ZbCbUMxyw5gLZY6UiUS98LYV5unm8GWmfkIS6jqJfb4E" crossorigin="anonymous" />' +
            '<link rel="stylesheet" href="/public/stylesheets/customerInvoice.css">' +
            '<title>' + invoiceNumber + '</title>' +
            '</head>' +
            '<body onload="window.print(); window.close();">' +
            divToPrint.innerHTML +
            '</body>' +
            '</html>';
        var popupWin = window.open();
        popupWin.document.open();
        popupWin.document.write(html);
        popupWin.document.close();

    })
})