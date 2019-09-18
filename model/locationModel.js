var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
    name_th: {
        type: String,
        require: true
    },
    name_eng: {
        type: String,
        require: true
    },
    city_th: {
        type: String,
        require: true,
    },
    city_eng: {
        type: String,
        require: true,
        trim: true
    },
    lat: {
        type: String,
        require: true,
        default: 0
    },
    lng: {
        type: String,
        require: true,
        default: 0
    }
});

var Location = mongoose.model('location', locationSchema);
module.exports = Location;