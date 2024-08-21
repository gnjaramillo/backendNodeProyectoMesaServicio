const mongoose = require('mongoose');

const ambienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
   
}, {
    timestamps: true
});

module.exports = mongoose.model('Ambiente', ambienteSchema);