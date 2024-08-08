
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true, // validación de correo
        match: /@sena\.edu\.co$/ // validación de dominio específico
    },
    rol: {
        type: String,
        enum: ['Funcionario', 'Lider TIC', 'Tecnico'],
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
    estado: {
        type: Boolean,
        default: false // campo oculto, es por defecto false para técnico, los otros roles: true, no necesitan aprobación (estado de aprobación)
    },   
    foto: {
        type: mongoose.Schema.Types.ObjectId, // ID del documento de la colección storage donde se almacena la imagen
        ref: 'Storage',
        required: false
    }
}, {
    timestamps: true
});

// Middleware para establecer el valor de 'aprobado' según el rol
usuarioSchema.pre('save', function(next) {
    if (this.rol === 'tecnico') {
        this.aprobado = false;
    } else {
        this.aprobado = true;
    }
    next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);




