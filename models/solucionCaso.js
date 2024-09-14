const mongoose = require('mongoose');

const solucionCasoSchema = new mongoose.Schema({
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud',
        required: true
    }, 

    descripcionSolucion: {
        type: String,
        required: true
    },
   
    tipoCaso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoDeCaso',
        required: true
    },

    tipoSolucion: {
        type: String,
        enum: ['pendiente', 'finalizado'],
        required: true,
    },

    evidencia: {
        type: mongoose.Schema.Types.ObjectId, // opcional
        ref: 'Storage',
        required: false
    }
}, 

{
    timestamps: true
});

module.exports = mongoose.model('SolucionCaso', solucionCasoSchema);
