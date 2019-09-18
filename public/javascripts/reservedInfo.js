$(document).ready(function () {
    $("#insurancePrice").val(150);
    var rentPrice = parseInt($("#rentPrice").val());
    $("#vat").val(
        ((rentPrice + parseInt($("#insurancePrice").val())) * 0.07).toFixed(2)
    );
    $("#totalPrice").val(
        (rentPrice + parseInt($("#insurancePrice").val()) + parseFloat($('#vat').val())).toFixed(2)
    );
    var nameInfo = $(".info-name-lastname");
    var contactInfo = $(".info-email-tel");
    var nameTaxPayer = $(".name-taxpayer");
    var addressTaxPayer = $(".address-taxpayer");
    var taxPayerID = $(".taxpayer-id");

    $("input[name='insurance']").click(function () {
        let insurancePrice = 0;
        let vat = 0;
        let totalPrice = 0;
        console.log($("input[name='insurance']:checked").val());
        if ($("input[name='insurance']:checked").val() == "standard") {
            insurancePrice = 150;
            vat = (rentPrice + insurancePrice) * 0.07;
            totalPrice = rentPrice + insurancePrice + vat;
            $("#insurancePrice").val(insurancePrice);
            $("#vat").val(vat.toFixed(2));
            $("#totalPrice").val(totalPrice.toFixed(2));
        } else {
            insurancePrice = 500;
            vat = (rentPrice + insurancePrice) * 0.07;
            totalPrice = rentPrice + insurancePrice + vat;
            $("#insurancePrice").val(insurancePrice);
            $("#vat").val(vat.toFixed(2));
            $("#totalPrice").val(totalPrice.toFixed(2));
        }
    });

    $("#otherReserve").click(function () {
        if ($("#otherReserve").is(":checked")) {
            nameInfo.show();
            contactInfo.show();
        } else {
            nameInfo.hide();
            contactInfo.hide();
        }
    });

    $("#taxInvoice").click(function () {
        if ($("#taxInvoice").is(":checked")) {
            nameTaxPayer.show();
            addressTaxPayer.show();
            taxPayerID.show();
        } else {
            nameTaxPayer.hide();
            addressTaxPayer.hide();
            taxPayerID.hide();
        }
    });
});