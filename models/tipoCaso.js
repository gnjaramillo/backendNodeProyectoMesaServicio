const mongoose = require('mongoose');

const tipoDeCasoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
}, 

{
    timestamps: true
});

module.exports = mongoose.model('TipoDeCaso', tipoDeCasoSchema);
