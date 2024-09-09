
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // formato correo electrónico
    },
    
    rol: {
        type: String,
        enum: ['funcionario', 'lider', 'tecnico'],
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false //ocultar contraseña en las consultas
    },
    activo: {
        type: Boolean,
        default: true //  indica si el usuario está activo o inactivo
    },
    estado: {
        type: Boolean,
        default: false // para rol técnico (estado de aprobación de registro)
    },   
    foto: {
        type: mongoose.Schema.Types.ObjectId, // ID colección storage almacena la imagen
        ref: 'Storage',
        required: false
    },
    resetPasswordToken: String,  // Campo para almacenar el token de recuperación de contraseña
    resetPasswordExpires: Date,  // Fecha de expiración del token

}, {
    timestamps: true
});


usuarioSchema.pre('save', function(next) {
    // Solo establece estado en false si es un nuevo técnico
    if (this.isNew && this.rol === 'tecnico') {
        this.estado = false;
    }
    next();
});


module.exports = mongoose.model('Usuario', usuarioSchema); 



