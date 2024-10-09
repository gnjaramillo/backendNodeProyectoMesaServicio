/* 
const mongoose = require('mongoose');

const consecutivoCasoSchema = new mongoose.Schema({
    yearMonth: {
        type: String, //  "YYYY-MM"
        required: true,
        unique: true
    },
    sequence: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Consecutivo', consecutivoCasoSchema);
 */