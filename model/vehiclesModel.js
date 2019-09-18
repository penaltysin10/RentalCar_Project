var mongoose = require('mongoose');

var vehicleSchema = mongoose.Schema({
    model_id: {
        type: Number,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    model: {
        type: String,
        require: true
    },
    gear: {
        type: String,
        require: true
    },
    year: {
        type: String,
        require: true
    },
    types: {
        type: String,
        require: true
    },
    fuel: {
        type: String,
        require: true
    },
    capacity: {
        type: String,
        require: true
    },
    daily_rate: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    }
});

var Vehicle = mongoose.model('vehicle', vehicleSchema);
module.exports = Vehicle;