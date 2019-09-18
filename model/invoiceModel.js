var mongoose = require('mongoose');

var invoiceModel = mongoose.Schema({
    invoice_number: {
        type: String,
        require: true
    },
    reservation_id: {
        type: String,
        require: true
    },
    customer_id: {
        type: String,
        require: true
    },
    car_id: {
        type: String,
        require: true
    },
    booking_date: {
        type: String,
        require: true
    },
    start_date: {
        type: String,
        require: true
    },
    end_date: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    total_price: {
        type: Number,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    tel: {
        type: String,
        require: true
    },
    creditcard_no: {
        type: String,
        require: true
    }
});

var Invoice = mongoose.model('invoice', invoiceModel);
module.exports = Invoice;