const mongoose = require('mongoose');

const casoSchema = new mongoose.Schema({
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud',
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['solicitado','asignado', 'en curso', 'pendiente', 'finalizado'],
        required: true
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoDeCaso',
        required: true
    },
    archivo: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Caso', casoSchema);
