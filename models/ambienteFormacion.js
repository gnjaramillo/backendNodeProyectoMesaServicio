const mongoose = require('mongoose');

const ambienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },   
    sede: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sede',
        required: true
    }
   
}, {
    timestamps: true
});

module.exports = mongoose.model('Ambiente', ambienteSchema);