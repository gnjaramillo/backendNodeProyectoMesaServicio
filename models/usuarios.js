const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        enum: ['funcionario Sena', 'admin tics', 'tecnico tics'],
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false // para que al hacer una consulta, no se vea la contraseña
    },
    aprobado: {
        type: Boolean,
        default: false
    },
    foto: {
        type: mongoose.Schema.Types.ObjectId,  // ID del documento de la colección storage donde se almacena las img
        ref: 'storage',
        required: false // no es requerida
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);



