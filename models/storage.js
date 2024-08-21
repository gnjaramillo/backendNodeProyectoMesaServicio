const mongoose  = require("mongoose");

const storageSchema=mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    filename:{
        type:String,
        required:true
    },    
})

module.exports = mongoose.model("Storage", storageSchema)