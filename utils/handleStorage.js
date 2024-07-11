const path = require("path");
const multer = require("multer");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathStorage = path.join(__dirname, "../storage");
        cb(null, pathStorage);
    },
    filename: function (req, file, cb) {
        const extFile = file.originalname.split(".").pop();
        let filename = `file-${Date.now()}.${extFile}`;

        console.log("Original URL:", req.originalUrl);
        console.log("Base URL:", req.baseUrl);
        console.log("Body:", req.body);

        // Diferenciar filenames según el tipo de archivo
        if (req.originalUrl.includes('register') && req.body.correo) {
            filename = `usuario-${req.body.correo}.${extFile}`;
        } else if (req.originalUrl.includes('solucionCaso')) {
            filename = `evidence-${Date.now()}.${extFile}`;
        }
        
        console.log("Generated filename:", filename);

        cb(null, filename);
    }
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;

/* Cuando configuras un almacenamiento personalizado con multer.diskStorage(), 
se configura el almacenamiento de los archivos en el disco.
Multer espera que proporciones funciones para destination y filename.
hay una convención en la API de Multer que define los 
parámetros que se pasan a las funciones destination y filename. 
donde el segundo parámetro siempre representa el 
archivo que se está subiendo.  */

/* const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
    
    //donde guardamos el archivo
    destination:function (req, file, cb) {
        const pathStorage = path.join(__dirname, "../storage");
        cb(null, pathStorage);
    },

    // nombre archivo
    filename: function (req, file, cb) {
        
        const extFile = file.originalname.split(".").pop();
        const filename = `file-${Date.now()}.${extFile}`;
        cb(null, filename)
        
    }
});

const uploadMiddleware = multer({storage});


module.exports = uploadMiddleware;  */
