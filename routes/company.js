var express = require("express");
var router = express.Router();
var _ = require("lodash");
var CompanyAdmin = require("../model/companyModel");
var Vehicle = require("../model/vehiclesModel");
var Location = require("../model/locationModel");
var Invoice = require("../model/invoiceModel");
var Reservation = require("../model/reservationModel");
var Customer = require("../model/customerModel");

/* GET home page. */
router.post("/", function (req, res, next) {
    CompanyAdmin.findOne({
            company_id: req.body.company_id
        },
        (err, comp) => {
            if (!err) {
                if (comp) {
                    if (comp.password == req.body.password) {
                        Customer.count({}, (err, countCustomers) => {
                            Vehicle.count({}, (err, countVehicles) => {
                                Location.count({}, (err, countLocations) => {
                                    Invoice.find((err, invoices) => {
                                        let monthlyIncome = 0;
                                        let monthlyBooking = 0;
                                        let totalIncome = 0;
                                        let totalBooking = invoices.length;
                                        invoices.forEach(invoice => {
                                            let nowMonth = new Date().getMonth() + 1;
                                            let monthBooking = new Date(invoice.booking_date).getMonth() + 1;
                                            if (monthBooking == nowMonth) {
                                                monthlyIncome += invoice.total_price;
                                                monthlyBooking += 1;
                                            }
                                            totalIncome += invoice.total_price;
                                        });
                                        res.render("companyIndex", {
                                            companyAdmin: comp,
                                            numCustomers: countCustomers,
                                            numVehicles: countVehicles,
                                            numLocations: countLocations,
                                            monthlyIncome: monthlyIncome,
                                            monthlyBooking: monthlyBooking,
                                            totalIncome: totalIncome,
                                            totalBooking: totalBooking
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        console.log("Password is invalid!");
                        let error = "ID or Password is wrong, please try again."
                        res.render("companyLogin", {
                            error: error
                        });
                    }
                } else {
                    console.log("Company admin is not found!");
                    let error = "ID or Password is wrong, please try again."
                    res.render("companyLogin", {
                        error: error
                    });
                }
            } else {
                console.log(err);
            }
        }
    );
});
router.get("/:_id", function (req, res, next) {
    CompanyAdmin.findById(req.params._id, (err, data) => {
        if (!err) {
            Customer.count({}, (err, countCustomers) => {
                Vehicle.count({}, (err, countVehicles) => {
                    Location.count({}, (err, countLocations) => {
                        Invoice.find((err, invoices) => {
                            let monthlyIncome = 0;
                            let monthlyBooking = 0;
                            let totalIncome = 0;
                            let totalBooking = invoices.length;
                            invoices.forEach(invoice => {
                                let nowMonth = new Date().getMonth() + 1;
                                let monthBooking = new Date(invoice.booking_date).getMonth() + 1;
                                if (monthBooking == nowMonth) {
                                    monthlyIncome += invoice.total_price;
                                    monthlyBooking += 1;
                                }
                                totalIncome += invoice.total_price;
                            });
                            res.render("companyIndex", {
                                companyAdmin: data,
                                numCustomers: countCustomers,
                                numVehicles: countVehicles,
                                numLocations: countLocations,
                                monthlyIncome: monthlyIncome,
                                monthlyBooking: monthlyBooking,
                                totalIncome: totalIncome,
                                totalBooking: totalBooking
                            });
                        });
                    });
                });
            });
        } else {
            console.log(err);
        }
    });
});
router.get("/listCar/:_id", function (req, res, next) {
    console.log(req.params._id);
    CompanyAdmin.findById(req.params._id, (err, doc) => {
        if (!err) {
            Vehicle.find((err, data) => {
                if (!err) {
                    console.log("List : " + data);
                    console.log("Admin : " + doc);
                    res.render("companyListCar", {
                        list_car: data,
                        companyAdmin: doc
                    });
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log("Error not found _id!");
        }
    });
});
router.get("/listCar/:_adminId/delete/:_vehicleId", function (req, res, next) {
    Vehicle.findByIdAndRemove(req.params._vehicleId, (err, data) => {
        if (!err) {
            res.redirect("/company/listCar/" + req.params._adminId);
        } else {
            console.log(err);
        }
    });
});
router.get("/createCar/:_id", function (req, res, next) {
    CompanyAdmin.findById(req.params._id, (err, data) => {
        if (!err) {
            res.render("companyCreateCar", {
                companyAdmin: data
            });
        } else {
            console.log(err);
        }
    });
});
router.post("/createCar/:_id/sendCarInfo", function (req, res, next) {
    CompanyAdmin.findById(req.params._id, (err, data) => {
        if (!err) {
            Vehicle.findOne({}, {}, {
                    sort: {
                        _id: -1
                    }
                },
                (err, count) => {
                    console.log(count);
                    var doc = new Vehicle({
                        model_id: count.model_id + 1,
                        brand: req.body.brand,
                        model: req.body.model,
                        gear: req.body.gear,
                        year: req.body.year,
                        types: req.body.types,
                        fuel: req.body.fuel,
                        capacity: req.body.capacity,
                        daily_rate: parseInt(req.body.daily_rate),
                        image: "/public/images/cars/" + req.body.image
                    });
                    doc.save((err, result) => {
                        if (!err) {
                            res.redirect("/company/listCar/" + req.params._id);
                        } else {
                            console.log(err);
                        }
                    });
                }
            );
        } else {
            console.log(err);
        }
    });
});
router.get("/listCar/:_adminId/edit/:_vehicleId", function (req, res, next) {
    CompanyAdmin.findById(req.params._adminId, (err, admin) => {
        if (!err) {
            Vehicle.findById(req.params._vehicleId, (err, vehicle) => {
                if (!err) {
                    res.render("companyEditCar", {
                        companyAdmin: admin,
                        vehicle: vehicle
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
router.post("/editCar/:_adminID/sendCarUpdate/:_vehicleID", function (
    req,
    res,
    next
) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            var updateCar = {
                brand: req.body.brand,
                model: req.body.model,
                gear: req.body.gear,
                year: req.body.year,
                types: req.body.types,
                fuel: req.body.fuel,
                capacity: req.body.capacity,
                daily_rate: parseInt(req.body.daily_rate),
                image: req.body.image
            };
            Vehicle.findByIdAndUpdate(
                req.params._vehicleID,
                updateCar,
                (err, vehicle) => {
                    if (!err) {
                        res.redirect("/company/listCar/" + req.params._adminID);
                    } else {
                        console.log(err);
                    }
                }
            );
        } else {
            console.log(err);
        }
    });
});
router.get("/manageLocation/:_adminID", function (req, res, next) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Location.find((err, locations) => {
                if (!err) {
                    res.render("companyManageLocation", {
                        companyAdmin: admin,
                        locations: locations
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
router.get("/manageLocation/:_adminID/createLocation", function (
    req,
    res,
    next
) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            res.render("companyCreateLocation", {
                companyAdmin: admin
            });
        } else {
            console.log(err);
        }
    });
});
router.post("/manageLocation/:_adminID/sendLocationInfo", function (
    req,
    res,
    next
) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            var location = new Location({
                name_th: req.body.nameth,
                name_eng: req.body.nameeng,
                city_th: req.body.cityth,
                city_eng: req.body.cityeng
            });
            location.save((err, data) => {
                if (!err) {
                    res.redirect("/company/manageLocation/" + req.params._adminID);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get("/manageLocation/:_adminID/editLocation/:_locationID", function (
    req,
    res,
    next
) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Location.findById(req.params._locationID, (err, location) => {
                if (!err) {
                    res.render("companyEditLocation", {
                        companyAdmin: admin,
                        location: location
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
router.post(
    "/manageLocation/:_adminID/sendUpdateLocation/:_locationID",
    function (req, res, next) {
        CompanyAdmin.findById(req.params._adminID, (err, admin) => {
            if (!err) {
                var updateLocation = {
                    name_th: req.body.nameth,
                    name_eng: req.body.nameeng,
                    city_th: req.body.cityth,
                    city_eng: req.body.cityeng
                };
                Location.findByIdAndUpdate(
                    req.params._locationID,
                    updateLocation,
                    (err, location) => {
                        if (!err) {
                            res.redirect("/company/manageLocation/" + req.params._adminID);
                        } else {
                            console.log(err);
                        }
                    }
                );
            } else {
                console.log(err);
            }
        });
    }
);
router.get("/manageLocation/:_adminID/deleteLocation/:_locationID", function (
    req,
    res,
    next
) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Location.findByIdAndRemove(req.params._locationID, (err, location) => {
                if (!err) {
                    res.redirect("/company/manageLocation/" + req.params._adminID);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});
router.get("/report/:_adminID", function (req, res, next) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Invoice.find({},
                null, {
                    sort: {
                        _id: -1
                    }
                },
                (err, invoices) => {
                    if (!err) {
                        Reservation.find({},
                            null, {
                                sort: {
                                    _id: -1
                                }
                            },
                            (err, reservations) => {
                                if (!err) {
                                    Vehicle.find((err, vehicles) => {
                                        if (!err) {
                                            console.log(invoices)
                                            console.log(reservations)
                                            res.render("companyReport", {
                                                companyAdmin: admin,
                                                invoices: invoices,
                                                reservations: reservations,
                                                vehicles: vehicles
                                            });
                                        } else {
                                            console.log(err);
                                        }
                                    });
                                } else {
                                    console.log(err);
                                }
                            }
                        );
                    } else {
                        console.log(err);
                    }
                }
            );
        } else {
            console.log(err);
        }
    });
});
router.get("/report/:_adminID/invoiceNumber/:_invoiceNumber", function (
    req,
    res,
    next
) {
    if (req.params._invoiceNumber != undefined) {
        console.log(req.params._invoiceNumber);
        CompanyAdmin.findById(req.params._adminID, (err, admin) => {
            if (!err) {
                Invoice.findOne({
                        invoice_number: req.params._invoiceNumber + ""
                    },
                    (err, invoice) => {
                        console.log(invoice);
                        if (!err) {
                            if (invoice) {
                                Reservation.findById(
                                    invoice.reservation_id,
                                    (err, reservation) => {
                                        if (!err) {
                                            Vehicle.findById(invoice.car_id, (err, vehicle) => {
                                                let invoices = [];
                                                let reservations = [];
                                                let vehicles = [];
                                                invoices.push(invoice);
                                                reservations.push(reservation);
                                                vehicles.push(vehicle);
                                                res.render("companyReport", {
                                                    companyAdmin: admin,
                                                    invoices: invoices,
                                                    reservations: reservations,
                                                    vehicles: vehicles
                                                });
                                            });
                                        } else {
                                            console.log(err);
                                        }
                                    }
                                );
                            } else {
                                Invoice.find({},
                                    null, {
                                        sort: {
                                            _id: -1
                                        }
                                    }, (err, invoices) => {
                                        Reservation.find((err, reservations) => {
                                            Vehicle.find((err, vehicles) => {
                                                var error = {
                                                    msg: "Invoice Number is not found, please try again."
                                                };
                                                res.render("companyReport", {
                                                    companyAdmin: admin,
                                                    invoices: invoices,
                                                    reservations: reservations,
                                                    vehicles: vehicles,
                                                    error: error
                                                });
                                            });
                                        });
                                    });
                            }
                        } else {
                            console.log(err);
                        }
                    }
                );
            } else {
                console.log(err);
            }
        });
    } else {
        res.redirect("/company/report/" + req.params._adminID);
    }
});
router.get("/reportWeek/:_adminID", function (req, res, next) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Invoice.find({}, null, {
                sort: {
                    _id: -1
                }
            }, (err, invoices) => {
                let invoicesWeek = [];
                invoices.forEach(invoice => {
                    let nowWeek = new Date().getDate() / 7;
                    let invoiceWeek = new Date(invoice.booking_date).getDate() / 7;
                    if (invoiceWeek == nowWeek) {
                        invoicesWeek.push(invoice);
                    }
                });
                Reservation.find((err, reservations) => {
                    if (!err) {
                        Vehicle.find((err, vehicles) => {
                            if (!err) {
                                res.render('companyReport', {
                                    companyAdmin: admin,
                                    invoices: invoicesWeek,
                                    reservations: reservations,
                                    vehicles: vehicles
                                })
                            } else {
                                console.log(err);
                            }
                        })
                    } else {
                        console.log(err);
                    }
                })
            })
        } else {
            console.log(err);
        }
    });
});
router.get("/reportMonth/:_adminID", function (req, res, next) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Invoice.find({}, null, {
                sort: {
                    _id: -1
                }
            }, (err, invoices) => {
                let invoicesMonth = [];
                invoices.forEach(invoice => {
                    let nowMonth = new Date().getMonth() + 1;
                    let invoiceMonth = new Date(invoice.booking_date).getMonth() + 1;
                    if (invoiceMonth == nowMonth) {
                        invoicesMonth.push(invoice);
                    }
                });
                Reservation.find((err, reservations) => {
                    if (!err) {
                        Vehicle.find((err, vehicles) => {
                            if (!err) {
                                res.render('companyReport', {
                                    companyAdmin: admin,
                                    invoices: invoicesMonth,
                                    reservations: reservations,
                                    vehicles: vehicles
                                })
                            } else {
                                console.log(err);
                            }
                        })
                    } else {
                        console.log(err);
                    }
                })
            })
        } else {
            console.log(err);
        }
    });
});
router.get('/invoiceDetail/:_adminID/:_invoiceID', function (req, res, next) {
    CompanyAdmin.findById(req.params._adminID, (err, admin) => {
        if (!err) {
            Invoice.findById(req.params._invoiceID, (err, invoice) => {
                console.log(invoice);
                if (!err) {
                    Vehicle.findById(invoice.car_id, (err, vehicle) => {
                        if (!err) {
                            var oneDay = 24 * 60 * 60 * 1000;
                            var firstDate = new Date(invoice.start_date);
                            var secondDate = new Date(invoice.end_date);
                            var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                            var rentPrice = vehicle.daily_rate * diffDays;
                            var vat = invoice.total_price - rentPrice;
                            res.render('companyInvoiceDetail', {
                                companyAdmin: admin,
                                invoice: invoice,
                                vehicle: vehicle,
                                rentPrice: rentPrice,
                                vat: vat
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

module.exports = router;