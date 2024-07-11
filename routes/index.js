const express = require("express");
const fs = require("fs");
const router = express.Router();
//Esta variable siempre contiene la ruta completa del directorio donde se encuentra el archivo actual, 
const PATH_ROUTES = __dirname;


const removeExtension = (fileName)=>{
    // usuarios.js ...  [usuarios, js] ... usuarios
    return fileName.split('.').shift()
}

// esto me devuelve un directorio como un array, 
// Leer los archivos del directorio actual
fs.readdirSync(PATH_ROUTES).filter((file)=>{
      

    const name = removeExtension(file) // de usuarios.js a usuarios, loteCafe, etc
    if(name !== "index"){
        
        // Montar la ruta dinámica bajo /api/nombreRuta

        router.use(`/${name}`, require(`./${file}`) ) // http://localhost:3005/api/usuarios

    }
})

module.exports = router





