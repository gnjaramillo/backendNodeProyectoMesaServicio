const mongoose = require('mongoose');

const solucionCasoSchema = new mongoose.Schema({
    caso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caso',
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
    evidencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
        required: function() { return this.estado === 'pendiente'; } // obligatorio si el estado es "pendiente"
    }
}, 

{
    timestamps: true
});

module.exports = mongoose.model('SolucionCaso', solucionCasoSchema);
