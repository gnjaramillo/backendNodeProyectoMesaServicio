const mongoose = require('mongoose');

const centroDeFormacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    municipio: {
        type: String,
        required: true
    },
    regional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regional',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CentroDeFormacion', centroDeFormacionSchema);
