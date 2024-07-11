const mongoose = require('mongoose');

const regionalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }   
}, {
    timestamps: true
});

module.exports = mongoose.model('Regional', regionalSchema);
