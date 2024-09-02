// controllers/storage.js

const { storageModel } = require("../models");
const PUBLIC_URL = process.env.PUBLIC_URL;
const {handleHttpError} = require("../utils/handleError")
const fs = require('fs');
const path = require('path');


const createStorage = async (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(400).send({ message: "archivo no cargado" });
    }

    const fileData = {
        filename: file.filename,
        url: `${PUBLIC_URL}/${file.filename}`
    };

    try {
        const data = await storageModel.create(fileData);
        res.status(201).send({ message: "archivo creado exitosamente", file: data });
    } catch (error) {
        handleHttpError(res, "Error al crear archivo");
    }
};



const getStorage = async (req,res) =>{
    try {

        const data = await storageModel.find({})
        res.send({data})
        
    } catch (error) {
        handleHttpError(res, "error al obtener datos");
    }
};



const getStorageId = async (req,res) =>{
    const Id = req.params.id;
    try {

        const data = await storageModel.findById(Id)

        if (!data) {
            handleHttpError(res, "archivo no encontrado")
            return
        }
        res.send({message: "archivo consultado exitosamente", data})
        
    } catch (error) {
        handleHttpError(res, "error al obtener archivo");
    }
};



const updateStorage = async (req, res) => {
    const Id = req.params.id;
    const { body, file } = req;

    try {
        // Buscar el registro actual en la base de datos
        const storageData = await storageModel.findById(Id);

        if (!storageData) {
            return handleHttpError(res, "Archivo no encontrado", 404);
        }

        // datos de actualización
        let updateData = { ...body };

        // Si se sube un nuevo archivo, eliminar el archivo anterior
        if (file) {
            const pathStorage = path.join(__dirname, '../storage', storageData.filename);

            // Actualizar los datos
            updateData.filename = file.filename;
            updateData.url = `${PUBLIC_URL}/${file.filename}`;

            // Eliminar el archivo físico anterior
            fs.unlink(pathStorage, (err) => {
                if (err) {
                    return handleHttpError(res, "Error al eliminar el archivo físico");

                } 
            });
        }

        
        const data = await storageModel.findOneAndUpdate({ _id: Id }, updateData, { new: true });

        res.send({ message: `Archivo ${Id} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "Error al actualizar archivo");
    }
};



const deleteStorage = async (req, res) => {
    const Id = req.params.id;

    try {
        // Buscar el registro actual en la base de datos
        const data = await storageModel.findByIdAndDelete(Id);
        if (!data) {
            return handleHttpError(res, "Archivo no encontrado", 404);
        }

        // Ruta del archivo físico a eliminar
        const pathStorage = path.join(__dirname, '../storage', data.filename);

        // Eliminar el archivo físico
        fs.unlink(pathStorage, (err) => {
            if (err) {
                console.error("Error al eliminar el archivo físico:", err);
                return handleHttpError(res, "Error al eliminar el archivo físico");
            }

            // Enviar respuesta exitosa
            res.send({ message: `Archivo ${Id} eliminado correctamente` });
        });

    } catch (error) {
        handleHttpError(res, "Error al eliminar la imagen");
    }
}







module.exports = { createStorage, getStorage, getStorageId, updateStorage, deleteStorage };
    

/*  Después de que Multer procesa la solicitud, añade una propiedad file al objeto req. 
Esta propiedad contiene información sobre el archivo subido. */

/* Para asegurarte de que estás guardando la información correcta 
 en tu base de datos, necesitas construir un objeto con los datos del 
 archivo y guardarlo: crear la const fileData y escojo q guardar sgn mi modelo de storage, 
 en mi caso seria url (para esto toca configurar los datos publicos en app.js asi.. 
 app.use(express.static("storage"))) y nombre (filename) y en mi archivo env
 PUBLIC_URL = http://localhost:3010 */


/*   fn de node  para eliminar archivos del sistema de archivos de manera asíncrona.:
fs.unlink(path, callback): Esta función toma dos argumentos principales:

path: Es la ruta del archivo que deseas eliminar.
callback: Es una función que se ejecuta cuando la operación de eliminación ha terminado. 
Esta función recibe un argumento err, que contendrá un error si algo salió mal durante la eliminación del archivo.
Funcionamiento: */