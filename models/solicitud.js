const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const solicitudSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
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

    codigoCaso: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        enum: ['solicitado', 'asignado', 'pendiente', 'finalizado'],
        required: true,
        default: 'solicitado'
    },

    tecnico:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },

    // Nuevo campo para enlazar la solución
    solucion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SolucionCaso',
        required: false
    },
     
    foto: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Storage',
        required: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.fecha = DateTime.fromJSDate(ret.fecha).setLocale('es').toFormat('dd-MM-yyyy HH:mm');
            return ret;
        }
    }
    
});

module.exports = mongoose.model('Solicitud', solicitudSchema);
