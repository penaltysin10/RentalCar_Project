var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    tel: String,
    credit_card: {
        type: String,
        default: ''
    }
});

var Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;