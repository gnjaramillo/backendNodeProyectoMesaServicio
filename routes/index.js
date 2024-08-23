
const express = require("express");
const fs = require("fs");
const router = express.Router();

// Esta variable siempre contiene la ruta completa del directorio donde se encuentra el archivo actual
const PATH_ROUTES = __dirname;

const removeExtension = (fileName) => {
    // usuarios.js ...  [usuarios, js] ... usuarios
    return fileName.split('.').shift();
}

// Leer los archivos del directorio actual
fs.readdirSync(PATH_ROUTES).filter((file) => {
    const name = removeExtension(file);
    if (name !== "index") {
        const route = require(`./${file}`);
        
        // Verificar que lo exportado sea un enrutador válido
        if (typeof route === 'function' || (typeof route === 'object' && typeof route.use === 'function')) {
            router.use(`/${name}`, route); // http://localhost:3005/api/usuarios
        } else {
            console.error(`El archivo ${file} no exporta un enrutador válido.`);
        }
    }
});

module.exports = router;






