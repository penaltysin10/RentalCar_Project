var express = require('express');
var router = express.Router();
var customer = require('../model/customerModel');
var Vehicles = require('../model/vehiclesModel');
var Location = require('../model/locationModel');
var Reservation = require('../model/reservationModel');
var Invoice = require('../model/invoiceModel');
var _ = require('lodash');

router.get('/:_id', function (req, res, next) {
    customer.findById(req.params._id, (err, data) => {
        if (!err) {
            Location.find((err, locations) => {
                if (!err) {
                    res.render('customerIndex', {
                        customer: data,
                        locations: locations
                    })
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.post('/', function (req, res, next) {
    customer.findOne({
        email: req.body.email
    }, (err, data) => {
        if (!err && data) {
            if (data.password == req.body.password) {
                Location.find((err, locations) => {
                    if (!err) {
                        console.log("Customer login success! : " + data);
                        res.render('customerIndex', {
                            customer: data,
                            locations: locations
                        });
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log("Password is invalid!");
                let error = "Email or Password is wrong, please try again.";
                res.render('userLogin', {
                    error: error
                });
            }
        } else {
            console.log("Email is not found!\n" + err);
            let error = "Email or Password is wrong, please try again.";
            res.render('userLogin', {
                error: error
            });
        }
    });
});
router.get('/SearchResult/:_id', function (req, res, next) {
    customer.findById(req.params._id, (err, cust) => {
        if (!err) {
            console.log(req.query.startDate + " " + req.query.endDate + " " + req.query.locationPick);
            Vehicles.find((err, vehicles) => {
                if (!err) {
                    Location.find((err, locations) => {
                        if (!err) {
                            res.render('customerSearch', {
                                customer: cust,
                                vehicles: vehicles,
                                startDate: req.query.startDate,
                                endDate: req.query.endDate,
                                locationPick: req.query.locationPick,
                                locations: locations
                            })
                        } else {
                            console.log(err);
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    });
});
router.get('/RentalCarDetails/:_custID', function (req, res, next) {
    console.log(req.query.vehicleID);
    console.log(req.query.startDate + " " + req.query.endDate + " " + req.query.locationPick);
    console.log(req.params._custID);
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            Vehicles.findById(req.query.vehicleID, (err, vehicle) => {
                if (!err) {
                    Location.find((err, locations) => {
                        if (!err) {
                            var oneDay = 24 * 60 * 60 * 1000;
                            var firstDate = new Date(req.query.startDate);
                            var secondDate = new Date(req.query.endDate);
                            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                            var rentPrice = vehicle.daily_rate * diffDays;
                            res.render('rentCarDetail', {
                                customer: cust,
                                vehicle: vehicle,
                                startDate: req.query.startDate,
                                endDate: req.query.endDate,
                                locationPick: req.query.locationPick,
                                locations: locations,
                                diffDays: diffDays,
                                rentPrice: rentPrice
                            })
                        } else {
                            console.log(err);
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    });
})
router.get('/ReservationForm/:_custID/:_vehicleID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            Vehicles.findById(req.params._vehicleID, (err, vehicle) => {
                if (!err) {
                    var oneDay = 24 * 60 * 60 * 1000;
                    var firstDate = new Date(req.query.startDate);
                    var secondDate = new Date(req.query.endDate);
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    var rentPrice = vehicle.daily_rate * diffDays;
                    res.render('reservedInfo', {
                        customer: cust,
                        vehicle: vehicle,
                        startDate: req.query.startDate,
                        endDate: req.query.endDate,
                        locationPick: req.query.locationPick,
                        rentPrice: rentPrice
                    })
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get('/PaymentForm/:_custID/:_vehicleID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            console.log(req.params._vehicleID)
            console.log(req.query.startDate + " " + req.query.endDate + " " + req.query.locationPick);
            Vehicles.findById(req.params._vehicleID, (err, vehicle) => {
                if (!err) {
                    var time = new Date();
                    var reservationNumber = Math.random().toString(36).substring(2, 15).toUpperCase() + "-" + time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate();
                    var bookingDate = time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
                    if (req.query.otherReserve != undefined) {
                        if (req.query.taxInvoice != undefined) {
                            let reserve = new Reservation({
                                reservation_number: reservationNumber,
                                customer_id: cust._id,
                                car_id: vehicle._id,
                                booking_date: bookingDate,
                                start_date: req.query.startDate,
                                end_date: req.query.endDate,
                                location: req.query.locationPick,
                                total_price: parseFloat(req.query.totalPrice).toFixed(2),
                                insurance_type: req.query.insurance,
                                firstname: req.query.firstname,
                                lastname: req.query.lastname,
                                email: req.query.emailInput,
                                tel: req.query.telInput,
                                name_taxpayer: req.query.nameTaxPayer,
                                address_taxpayer: req.query.addressTaxPayer,
                                taxpayer_id: req.query.taxPayerID,
                                flight_number: req.query.flightNumber,
                                other_info: req.query.otherInfo
                            });
                            reserve.save((err, data) => {
                                if (!err) {
                                    res.render('customerPayment', {
                                        customer: cust,
                                        vehicle: vehicle,
                                        reservation: data
                                    })
                                } else {
                                    console.log('Reservation is not found!\n' + err);
                                }
                            });
                        } else {
                            let reserve = new Reservation({
                                reservation_number: reservationNumber,
                                customer_id: cust._id,
                                car_id: vehicle._id,
                                booking_date: bookingDate,
                                start_date: req.query.startDate,
                                end_date: req.query.endDate,
                                location: req.query.locationPick,
                                total_price: parseFloat(req.query.totalPrice).toFixed(2),
                                insurance_type: req.query.insurance,
                                firstname: req.query.firstname,
                                lastname: req.query.lastname,
                                email: req.query.emailInput,
                                tel: req.query.telInput,
                                flight_number: req.query.flightNumber,
                                other_info: req.query.otherInfo
                            });
                            reserve.save((err, data) => {
                                if (!err) {
                                    res.render('customerPayment', {
                                        customer: cust,
                                        vehicle: vehicle,
                                        reservation: data
                                    })
                                } else {
                                    console.log('Reservation is not found!\n' + err);
                                }
                            });
                        }
                    } else {
                        if (req.query.taxInvoice != undefined) {
                            let reserve = new Reservation({
                                reservation_number: reservationNumber,
                                customer_id: cust._id,
                                car_id: vehicle._id,
                                booking_date: bookingDate,
                                start_date: req.query.startDate,
                                end_date: req.query.endDate,
                                location: req.query.locationPick,
                                total_price: parseFloat(req.query.totalPrice).toFixed(2),
                                insurance_type: req.query.insurance,
                                firstname: cust.firstname,
                                lastname: cust.lastname,
                                email: cust.email,
                                tel: cust.tel,
                                name_taxpayer: req.query.nameTaxPayer,
                                address_taxpayer: req.query.addressTaxPayer,
                                taxpayer_id: req.query.taxPayerID,
                                flight_number: req.query.flightNumber,
                                other_info: req.query.otherInfo
                            });
                            reserve.save((err, data) => {
                                if (!err) {
                                    res.render('customerPayment', {
                                        customer: cust,
                                        vehicle: vehicle,
                                        reservation: data
                                    })
                                } else {
                                    console.log('Reservation is not found!\n' + err);
                                }
                            });
                        } else {
                            let reserve = new Reservation({
                                reservation_number: reservationNumber,
                                customer_id: cust._id,
                                car_id: vehicle._id,
                                booking_date: bookingDate,
                                start_date: req.query.startDate,
                                end_date: req.query.endDate,
                                location: req.query.locationPick,
                                total_price: parseFloat(req.query.totalPrice).toFixed(2),
                                insurance_type: req.query.insurance,
                                firstname: cust.firstname,
                                lastname: cust.lastname,
                                email: cust.email,
                                tel: cust.tel,
                                flight_number: req.query.flightNumber,
                                other_info: req.query.otherInfo
                            });
                            reserve.save((err, data) => {
                                if (!err) {
                                    res.render('customerPayment', {
                                        customer: cust,
                                        vehicle: vehicle,
                                        reservation: data
                                    })
                                } else {
                                    console.log('Reservation is not found!\n' + err);
                                }
                            });
                        }
                    }
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get('/InvoiceForm/:_custID/:_vehicleID/:_reservationID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            Vehicles.findById(req.params._vehicleID, (err, vehicle) => {
                if (!err) {
                    Reservation.findById(req.params._reservationID, (err, reservation) => {
                        if (!err) {
                            var time = new Date();
                            var invoiceNumber = Math.random().toString(36).substring(2, 15).toUpperCase() + "-" + time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
                            var invoice = new Invoice({
                                invoice_number: invoiceNumber,
                                reservation_id: reservation._id,
                                customer_id: cust._id,
                                car_id: vehicle._id,
                                booking_date: reservation.booking_date,
                                start_date: reservation.start_date,
                                end_date: reservation.end_date,
                                location: reservation.location,
                                total_price: reservation.total_price,
                                firstname: reservation.firstname,
                                lastname: reservation.lastname,
                                email: reservation.email,
                                tel: reservation.tel,
                                creditcard_no: req.query.cardNo
                            });
                            invoice.save((err, invoice) => {
                                if (!err) {
                                    var oneDay = 24 * 60 * 60 * 1000;
                                    var firstDate = new Date(reservation.start_date);
                                    var secondDate = new Date(reservation.end_date);
                                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                                    var rentPrice = vehicle.daily_rate * diffDays;
                                    var vat = reservation.total_price - rentPrice;
                                    res.render('customerInvoice', {
                                        customer: cust,
                                        vehicle: vehicle,
                                        reservation: reservation,
                                        invoice: invoice,
                                        date: new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDay(),
                                        vat: vat,
                                        rentPrice: rentPrice
                                    })
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get('/CancelPayment/:_custID/:_reservationID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            Reservation.findByIdAndRemove(req.params._reservationID, (err, result => {
                if (!err) {
                    res.redirect('/customer/' + cust._id);
                } else {
                    console.log(err);
                }
            }));
        } else {
            console.log(err);
        }
    });
});
router.get('/Mybooking/:_custID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            Invoice.find({
                customer_id: cust._id
            }, {}, {
                sort: {
                    _id: -1
                }
            }, (err, invoices) => {
                if (!err) {
                    Reservation.find({
                        customer_id: cust._id
                    }, {}, {
                        sort: {
                            _id: -1
                        }
                    }, (err, reservations) => {
                        if (!err) {
                            Vehicles.find((err, vehicles) => {
                                if (!err) {
                                    res.render('customerMyBooking', {
                                        customer: cust,
                                        invoices: invoices,
                                        reservations: reservations,
                                        vehicles: vehicles
                                    })
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get('/InvoiceInfo/:_custID/:_invoiceID/:_vehicleID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            Invoice.findById(req.params._invoiceID, (err, invoice) => {
                if (!err) {
                    Vehicles.findById(req.params._vehicleID, (err, vehicle) => {
                        if (!err) {
                            var oneDay = 24 * 60 * 60 * 1000;
                            var firstDate = new Date(invoice.start_date);
                            var secondDate = new Date(invoice.end_date);
                            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                            var rentPrice = vehicle.daily_rate * diffDays;
                            var vat = invoice.total_price - rentPrice;
                            res.render('customerInvoice', {
                                customer: cust,
                                invoice: invoice,
                                vehicle: vehicle,
                                vat: vat,
                                rentPrice: rentPrice
                            })
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get('/MyProfile/:_custID', function (req, res, next) {
    customer.findById(req.params._custID, (err, cust) => {
        if (!err) {
            res.render('customerProfile', {
                customer: cust
            });
        } else {
            console.log(err);
        }
    });
});
router.post('/EditProfile/:_custID', function (req, res, next) {
    if (req.body.reOldPassword != "" || req.body.newPassword != "") {
        if (req.body.reOldPassword != req.body.oldPassword) {
            var error = {
                msg: 'Password is invalid!, please try again.'
            };
            customer.findById(req.params._custID, (err, cust) => {
                if (!err) {
                    res.render('customerProfile', {
                        customer: cust,
                        error: error
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            var updateProfile = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.newPassword,
                tel: req.body.tel
            }
            customer.findByIdAndUpdate(req.params._custID, updateProfile, (err, cust) => {
                if (!err) {
                    res.redirect('/customer/MyProfile/' + req.params._custID);
                } else {
                    console.log(err);
                }
            });
        }
    } else {
        var updateProfile = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            tel: req.body.tel
        }
        customer.findByIdAndUpdate(req.params._custID, updateProfile, (err, cust) => {
            if (!err) {
                res.redirect('/customer/MyProfile/' + req.params._custID);
            } else {
                console.log(err);
            }
        });
    }
});

module.exports = router;