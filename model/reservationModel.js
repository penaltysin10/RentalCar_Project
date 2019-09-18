var mongoose = require('mongoose');

var reservationModel = mongoose.Schema({
    reservation_number: {
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
    insurance_type: {
        type: String,
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
    name_taxpayer: {
        type: String,
        require: true,
        default: ''
    },
    address_taxpayer: {
        type: String,
        require: true,
        default: ''
    },
    taxpayer_id: {
        type: String,
        require: true,
        default: ''
    },
    flight_number: {
        type: String,
        require: true,
        default: ''
    },
    other_info: {
        type: String,
        require: true,
        default: ''
    }
});

var Reservation = mongoose.model('reservation', reservationModel);
module.exports = Reservation;