
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
    estado: {
        type: Boolean,
        default: false // false para técnico, true otros roles (estado de aprobación de registro)
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

// Middleware para establecer el valor de 'aprobado' según el rol
usuarioSchema.pre('save', function(next) {
    if (this.rol === 'tecnico') {
        this.estado = false;
    } else {
        this.estado = true;
    }
    next();
});

module.exports = mongoose.model('Usuario', usuarioSchema); 



/*     correo: {
        type: String,
        required: true,
        unique: true, // validación de correo
        match: /@sena\.edu\.co$/ // validación de dominio específico

    }, */


/* const mongoose = require('mongoose');

    const usuarioSchema = new mongoose.Schema({
        nombre: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true,
            unique: true, // Asegura que el correo electrónico sea único
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validación del formato de correo electrónico
            // Si quieres usar un dominio específico, usa la siguiente validación:
            // match: /@sena\.edu\.co$/
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
            required: true
            // select: false // Descomenta si quieres que la contraseña no se incluya en las consultas
        },
        estado: {
            type: Boolean,
            default: false // Por defecto es false para técnicos; para otros roles será true
        },
        resetPasswordToken: String,  // Campo para almacenar el token de recuperación de contraseña
        resetPasswordExpires: Date,  // Fecha de expiración del token
    },
    {
        timestamps: true
    });
    
    // Middleware para establecer el valor de 'estado' según el rol
    usuarioSchema.pre('save', function(next) {
        if (this.rol === 'tecnico') {
            this.estado = false;
        } else {
            this.estado = true;
        }
        next();
    });
    
    module.exports = mongoose.model('Usuario', usuarioSchema);  */