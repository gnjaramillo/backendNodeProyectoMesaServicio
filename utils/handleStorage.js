
// utils/handleStorage.js

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathStorage = path.join(__dirname, "../storage");
        cb(null, pathStorage);
    },
    filename: function (req, file, cb) {
        const extFile = file.originalname.split(".").pop();
        const filename = `file-${Date.now()}.${extFile}`;
        cb(null, filename);
    }
});

const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware;

    

/* Cuando configuras un almacenamiento personalizado con multer.diskStorage(), 
se configura el almacenamiento de los archivos en el disco.
Multer espera que proporciones funciones para destination y filename.
hay una convención en la API de Multer que define los 
parámetros que se pasan a las funciones destination y filename. 
donde el segundo parámetro siempre representa el 
archivo que se está subiendo.  */