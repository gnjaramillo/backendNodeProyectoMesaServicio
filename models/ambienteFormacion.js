const mongoose = require('mongoose');

const ambienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true,  // Por defecto, el ambiente está activo
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ambiente', ambienteSchema);
