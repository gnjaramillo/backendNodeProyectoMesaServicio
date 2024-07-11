const mongoose = require('mongoose');

const centroDeFormacionUsuarioSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    centroDeFormacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CentroDeFormacion',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CentroDeFormacionUsuario', centroDeFormacionUsuarioSchema);
