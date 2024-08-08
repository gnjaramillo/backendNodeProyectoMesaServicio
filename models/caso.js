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
        enum: ['solicitado', 'asignado', 'pendiente', 'finalizado', 'reasignacion solicitada'],
        required: true,
        default: 'solicitado'
    }
    
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Caso', casoSchema);


