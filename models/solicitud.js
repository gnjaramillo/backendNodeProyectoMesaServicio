const mongoose = require('mongoose');
const moment = require('moment'); // npm install moment

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
            ret.fecha = moment(ret.fecha).format('DD-MM-YYYY HH:mm');
            return ret;
        }
    }
});

module.exports = mongoose.model('Solicitud', solicitudSchema);
