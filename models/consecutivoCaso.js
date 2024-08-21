const mongoose = require('mongoose')

const consecutivoCasoSchema = new mongoose.Schema({

    year:{
        type: Number,
        required:true,
        unique:true
    },

    sequence:{
        type: Number,
        required:true,
        default:1
    }
})

module.exports = mongoose.model('Consecutivo', consecutivoCasoSchema);