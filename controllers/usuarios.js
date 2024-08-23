const { usuarioModel, storageModel } = require("../models/index.js");
const { encrypt, compare } = require("../utils/handlePassword");
const { handleHttpError } = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL;
const fs = require('fs');
const path = require('path');
const transporter = require('../utils/handleEmail')
//---------------------------------------------------------------
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


// gestionar cuenta, actualizar datos de perfil

const updateUsuarios = async (req, res) => {
    const userId = req.params.id;
    const { body } = req;
    const file = req.file;

    try {
        // no pueden ser editados en el perfil
        delete body.nombre;
        delete body.rol;
        delete body.correo;

        let updatedData = { ...body };

        // Buscar el usuario y  la foto asociada
        const user = await usuarioModel.findById(userId).populate('foto');
        
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Eliminar la foto asociada si no es la predeterminada
        if (user.foto && user.foto.filename !== 'usuario-undefined.png') {
            await storageModel.findByIdAndDelete(user.foto._id);

            const pathStorage = path.join(__dirname, '../storage', user.foto.filename);
    
            // Eliminar el archivo físico
            fs.unlink(pathStorage, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo físico:", err);
                    return handleHttpError(res, "Error al eliminar el archivo físico");
                }
            });

        }

        // Manejo de contraseña
        if (body.password) {
            const { confirmPassword, password } = body;

            //  nueva contraseña y la confirmación coincidan
            if (confirmPassword !== password) {
                return res.status(401).send({ message: "Las contraseñas no coinciden" });
            }

            // Encriptar la nueva contraseña
            updatedData.password = await encrypt(password);
        }

        // Si se sube un archivo, agregar la URL de la foto a los datos actualizados
        if (file) {
            // Guardar el archivo en la colección storage
            const fileData = {
                url: `${PUBLIC_URL}/${file.filename}`,
                filename: file.filename
            };

            const fileSaved = await storageModel.create(fileData);

            // Actualizar el campo 'foto' con el ID del archivo guardado
            updatedData.foto = fileSaved._id;
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



const deleteUsuarios = async (req, res) => {
    const userId = req.params.id;

    try {
        // Buscar el usuario y  la foto asociada
        const user = await usuarioModel.findById(userId).populate('foto');
        
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Eliminar la foto asociada si no es la predeterminada
        if (user.foto && user.foto.filename !== 'usuario-undefined.png') {
            await storageModel.findByIdAndDelete(user.foto._id);

            const pathStorage = path.join(__dirname, '../storage', user.foto.filename);
    
            // Eliminar el archivo físico
            fs.unlink(pathStorage, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo físico:", err);
                    return handleHttpError(res, "Error al eliminar el archivo físico");
                }
            });

        }

        await usuarioModel.findByIdAndDelete(userId)
        res.send({ message: `Usuario ${userId} y su foto asociada han sido eliminados` });
    
    
    
    } catch (error) {
        handleHttpError(res, "Error al eliminar el usuario", 500);
    }
};





const listaTecnicosFalse = async (req,res)=>{
    
    try {
        const tecnicosFalse = await usuarioModel.find({ rol: 'tecnico', estado: false })
        .select('nombre correo estado telefono');
        
        
        if(!tecnicosFalse) {
            return res.status(500).send({message:" no hay tecnicos pendientes de aprobación"})
        }
        res.status(200).json({message:"lista de tecnicos pendientes de aprobacion", tecnicosFalse})
        
    } catch (error) {
        handleHttpError(res, "Error al listar tecnicos pendientes de aprobacion", 500);
        
    }
} 



const aprobarTecnico = async (req,res) =>{
    const id = req.params.id
    
    try {
        const tecnico = await usuarioModel.findByIdAndUpdate(id, {estado: true}, {new: true})
        if (!tecnico) {
            return res.status(404).send({ message: "Técnico no encontrado" });
        }        
        res.status(200).send({message: "Técnico aprobado exitosamente", tecnico })
             


    } catch (error) {
        handleHttpError(res, "Error al aprobar técnico", 500);
    }      
    
}



const denegarTecnico = async (req, res) => {
    const Id = req.params.id;

    try {
        // Buscar el usuario para obtener el ID de la foto asociada
        const tecnico = await usuarioModel.findById(Id).populate('foto');
        
        if (!tecnico) {
            return res.status(404).send({ message: "tecnico no encontrado" });
        }

        // Eliminar la foto asociada si no es la predeterminada
        if (tecnico.foto && tecnico.foto.filename !== 'usuario-undefined.png') {
            await storageModel.findByIdAndDelete(tecnico.foto._id);
            // Eliminar el archivo físico

            const pathStorage = path.join(__dirname, '../storage', tecnico.foto.filename);
            fs.unlink(pathStorage, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo físico:", err);
                    return handleHttpError(res, "Error al eliminar el archivo físico");
                }
            });
        }

        // Eliminar el usuario
        await usuarioModel.findByIdAndDelete(Id);

        res.send({ message: `tecnico ${Id} y su foto asociada han sido eliminados` });
    } catch (error) {
        handleHttpError(res, "Error al eliminar el usuario", 500);
    }
};






module.exports = { getUsuarios, updateUsuarios, deleteUsuarios, getUsuariosId, listaTecnicosFalse, aprobarTecnico, denegarTecnico };









 /*
populate es una función de Mongoose que se utiliza para reemplazar las referencias en un documento con los documentos a los que hacen referencia
 find() método de Mongoose que busca todos los documentos en la colección, La consulta {} indica que no hay filtros, por lo que se devuelven todos los documentos.
*/
//req.params es parte de Express.js y se utiliza para acceder a los parámetros de ruta en una solicitud HTTP.