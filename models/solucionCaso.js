const mongoose = require('mongoose');

const solucionCasoSchema = new mongoose.Schema({
    caso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caso',
        required: true
    },

    tipoSolucion: {
        type: String,
        required: true
    },

    evidencia: {
        type: mongoose.Schema.Types.ObjectId,  // ID del documento de la colección storage donde se almacena las img
        ref: 'storage',
        required: false // no es requerida
    }
}, 

{
    timestamps: true
});

module.exports = mongoose.model('SolucionCaso', solucionCasoSchema);
