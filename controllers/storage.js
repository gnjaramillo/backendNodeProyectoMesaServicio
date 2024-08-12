// controllers/storage.js

const { storageModel } = require("../models");
const PUBLIC_URL = process.env.PUBLIC_URL;

const createStorage = async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).send({ message: "No file uploaded" });
    }

    const fileData = {
        filename: file.filename,
        url: `${PUBLIC_URL}/${file.filename}`
    };

    try {
        const data = await storageModel.create(fileData);
        res.status(201).send({ message: "archivo creado exitosamente", file: data });
    } catch (error) {
        res.status(500).send({ message: "Error", error });
    }
};

module.exports = { createStorage };
    

/*  Después de que Multer procesa la solicitud, añade una propiedad file al objeto req. 
Esta propiedad contiene información sobre el archivo subido. */

/* Para asegurarte de que estás guardando la información correcta 
 en tu base de datos, necesitas construir un objeto con los datos del 
 archivo y guardarlo: crear la const fileData y escojo q guardar sgn mi modelo de storage, 
 en mi caso seria url (para esto toca configurar los datos publicos en app.js asi.. 
 app.use(express.static("storage"))) y nombre (filename) y en mi archivo env
 PUBLIC_URL = http://localhost:3010 */