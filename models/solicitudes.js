const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    ambienteDeFormacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambiente',
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    fechaDeRegistro: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Solicitud', solicitudSchema);
