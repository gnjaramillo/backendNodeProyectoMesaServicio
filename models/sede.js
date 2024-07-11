const mongoose = require('mongoose');

const sedeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },    
    centroFormacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CentroDeFormacion',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sede', sedeSchema);
