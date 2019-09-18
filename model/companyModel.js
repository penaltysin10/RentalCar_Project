var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    company_id: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    tel: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    }
});

var CompanyAdmin = mongoose.model('company', companySchema);
module.exports = CompanyAdmin;