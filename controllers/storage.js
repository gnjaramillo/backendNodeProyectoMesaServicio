
const {storageModel} = require("../models") // aqui llama al index.js de models
const PUBLIC_URL = process.env.PUBLIC_URL;

    
    //Crear un nuevo archivo y almacenarlo
    const createStorage = async (req, res) => {
        const {body, file}= req
        console.log(file)
       
        const fileData = {
            filename: file.filename,
            url: `${PUBLIC_URL}/${file.filename}`,
        }

        const data = await storageModel.create(fileData)
        res.status(201).send({ message: "archivo creado", file });
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