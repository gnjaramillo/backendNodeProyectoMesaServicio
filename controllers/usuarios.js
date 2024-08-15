const { usuarioModel, storageModel } = require("../models/index.js");
const { handleHttpError } = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL;
const { encrypt, compare } = require("../utils/handlePassword.js");
const { tokenSign } = require("../utils/handleJwt.js");





const getUsuarios = async (req, res) => {
    try {
        const data = await usuarioModel.find({}).populate('foto'); 
        res.send({ data });
    } catch (error) {
        handleHttpError(res, "error al obtener datos", 500);
    }
};



const getUsuariosId = async (req, res) => {
    try {
        const { id } = req.params;  
        const data = await usuarioModel.findById(id).populate('foto'); 
        if (!data) {
            res.send({ message: "Usuario no existe", data });
        }
        res.send({ message: "Usuario consultado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al consultar el usuario");
    }
};


const updateUsuarios = async (req, res) => {
    const userId = req.params.id;
    const { body } = req;
    const file = req.file;

    try {
        let updatedData = { ...body };

        // Si se sube un archivo, agregar la URL de la foto a los datos actualizados
        if (file) {
            // Guardar el archivo en la colección storage
            const fileData = {
                url: `${PUBLIC_URL}/${file.filename}`,
                filename: file.filename
            };
            const fileRecord = await storageModel.create(fileData);

            // Actualizar el campo 'foto' con el ID del archivo guardado
            updatedData.foto = fileRecord._id;
        }

        const data = await usuarioModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true });
        if (!data) {
            res.send({ message: "Usuario no existe", data });
        }
        res.send({ message: `Usuario ${userId} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "Error al actualizar el usuario", 500);
    }
};


/* const deleteUsuarios = async (req, res) => {
    const usuarioId = req.params.id;

    try {

        const usuarioBuscado = await usuarioModel.findById(usuarioId).populate('foto');

        if (!usuarioBuscado) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        if (usuarioBuscado.foto) {
            await usuarioModel.findOneAndDelete(usuarioBuscado.foto._id);
            
        }
        //usuario-guisellajp@example.com.jpg

        await usuarioModel.findOneAndDelete({_id:usuarioId});


        res.send({ message: `Usuario ${usuarioId} eliminado` });
    } catch (error) {
        handleHttpError(res, "Error al consultar el usuario", 500);

    }
}; */

const fs = require('fs');
const path = require('path');

const deleteUsuarios = async (req, res) => {
    const userId = req.params.id;

    try {
        // Buscar el usuario para obtener el ID de la foto asociada
        const user = await usuarioModel.findById(userId).populate('foto');
        
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Eliminar la foto asociada si existe
        if (user.foto) {
            const filePath = path.join(__dirname, '../storage', user.foto.filename);
            await storageModel.findByIdAndDelete(user.foto._id);

            // Eliminar el archivo físico
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo físico:", err);
                }
            });
        }

        // Eliminar el usuario
        await usuarioModel.findByIdAndDelete(userId);

        res.send({ message: `Usuario ${userId} y su foto asociada han sido eliminados` });
    } catch (error) {
        handleHttpError(res, "Error al eliminar el usuario", 500);
    }
};




/* const cambiarEstado = async (req,res)=>{

    const {id}=req.params

    try {
        const userFind = await usuarioModel.findById(id)

        if(!userFind) return res.status(500).json({message:"el usuario que quieres cambiar el estado no existe"})

        const usuarioEstadoAprobado = await userFind.findOneAndUpdate(id,estado=true)

        res.status(200).json({message:"estado de usuario actualizado",usuarioEstado:usuarioEstadoAprobado})

    } catch (error) {
        
    }


} */


module.exports = { getUsuarios, updateUsuarios, deleteUsuarios, getUsuariosId };









 /*
populate es una función de Mongoose que se utiliza para reemplazar las referencias en un documento con los documentos a los que hacen referencia
 find() método de Mongoose que busca todos los documentos en la colección, La consulta {} indica que no hay filtros, por lo que se devuelven todos los documentos.
*/
//req.params es parte de Express.js y se utiliza para acceder a los parámetros de ruta en una solicitud HTTP.