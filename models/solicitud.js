const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // traer nombre y correo 
        required: true
    },
    ambiente: {
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
    fecha: {
        type: Date,
        default: Date.now
    },   
    foto: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Storage',
        required: false // es opcional
    }


}, {
    timestamps: true
});

module.exports = mongoose.model('Solicitud', solicitudSchema);
