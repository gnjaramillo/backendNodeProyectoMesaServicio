const { usuarioModel, storageModel } = require("../models/index.js");
const { encrypt, compare } = require("../utils/handlePassword");
const { handleHttpError } = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL;
const fs = require('fs');
const path = require('path');
const transporter = require('../utils/handleEmail')
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



//perfil del usuario
const getPerfilUsuario = async (req,res) =>{

    try {
        const userId = req.usuario._id; 
        const data = await usuarioModel.findById(userId)
            .select('nombre rol foto')
            .populate('foto', 'url')

        if (!data) {
            return res.status(404).send({message: 'usuario no encontrado'})
            
        }
        res.send({message: 'perfil consultado', data})

        
    } catch (error) {
        handleHttpError(res, "Error al consultar el perfil del usuario", 500);
    }
}



//actualizar datos de perfil, excepto correo, rol y nombre
const updateUsuarios = async (req, res) => {
    const userId = req.usuario._id; 

    // const userId = req.params.id;
    const { body } = req;
    const file = req.file;

    try {
        // Estos campos no pueden ser editados en el perfil
        delete body.nombre;
        delete body.rol;
        delete body.correo;

        let updatedData = { ...body };

        // Buscar el usuario y la foto asociada
        const user = await usuarioModel.findById(userId).populate('foto');

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Manejo de actualizar contraseña
        if (body.password) {
            const { confirmPassword, password } = body;

            if (confirmPassword !== password) {
                return res.status(401).send({ message: "Las contraseñas no coinciden" });
            }

            updatedData.password = await encrypt(password);
        }

        // Si se sube un nuevo archivo (foto)
        if (file) {
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

            // Guardar el nuevo archivo en la colección storage
            const fileData = {
                url: `${PUBLIC_URL}/${file.filename}`,
                filename: file.filename
            };

            const fileSaved = await storageModel.create(fileData);
            updatedData.foto = fileSaved._id;
        }

        const data = await usuarioModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true });

        res.status(200).send({ message: `Usuario ${userId} actualizado exitosamente`, data });

    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        handleHttpError(res, "Error al actualizar el usuario", 500);
    }
};



//inactivar usuarios
const inactivarUsuarios = async (req, res) => {
    const userId = req.params.id;

    try {
        // Buscar el usuario y  la foto asociada
        const user = await usuarioModel.findById(userId).populate('foto');
        
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        if (!user.activo) {
            return res.status(404).send({ message: "Usuario ya esta inactivo" });
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

        user.activo = false;
        user.foto = null;
        await user.save();

        res.send({ message: `Usuario ${userId} ha sido inactivado` });
    
    
    
    } catch (error) {
        handleHttpError(res, "Error al inactivar el usuario", 500);
    }
};



// lista de tecnicos o usuarios inactivados
const usuariosInactivos = async (req, res) =>{
    try {
        
        const data = await usuarioModel.find({activo: false})
        .select('nombre correo telefono');
 
        res.send({ data });
    } catch (error) {
        handleHttpError(res, "error al obtener datos", 500);
}
}


//reactivar usuarios
const reactivarUsuarios = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await usuarioModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Si el usuario ya está activo
        if (user.activo) {
            return res.status(400).send({ message: "El usuario ya está activo" });
        }

        // Reactivar el usuario
        user.activo = true;

        // Asignar foto predeterminada si no tiene una
        if (!user.foto) {
            const defaultFoto = await storageModel.findOne({ filename: 'usuario-undefined.png' });
            if (defaultFoto) {
                user.foto = defaultFoto._id; 
            }
        }

        await user.save();
        res.send({ message: `Usuario ${userId} ha sido reactivado` });
    
    } catch (error) {
        handleHttpError(res, "Error al reactivar el usuario", 500);
    }
};


// lista usuarios inactivos (vista lider)



module.exports = { getUsuarios, getUsuariosId, getPerfilUsuario, updateUsuarios, inactivarUsuarios, usuariosInactivos, reactivarUsuarios };









 /*
populate es una función de Mongoose que se utiliza para reemplazar las referencias en un documento con los documentos a los que hacen referencia
 find() método de Mongoose que busca todos los documentos en la colección, La consulta {} indica que no hay filtros, por lo que se devuelven todos los documentos.
*/
//req.params es parte de Express.js y se utiliza para acceder a los parámetros de ruta en una solicitud HTTP (url).
//     const userId = req.usuario._id; // Obtener el ID del usuario autenticado
