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



//actualizar datos de perfil
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



// tecnicos sin registro aprobado
const listaTecnicosPendientes = async (req,res)=>{
    
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



// aprobar tecnico IMPLEMENTAR LO DEL CORREO DE NOTIFICACION,,,,
const aprobarTecnico = async (req,res) =>{
    const id = req.params.id
    
    try {        
        const tecnico = await usuarioModel.findByIdAndUpdate(id, {estado: true}, {new: true})
        if (!tecnico) {
            return res.status(404).send({ message: "Técnico no encontrado" });
        }        
        res.status(200).send({message: "Técnico aprobado exitosamente", tecnico })
      
        transporter.sendMail({
            from: process.env.EMAIL,
            to: tecnico.correo,
            subject: 'Aprobación de Registro - Mesa de Servicio - CTPI-CAUCA',
                html: `Cordial saludo, ${tecnico.nombre}.<br><br>
                    Nos complace informarle que su cuenta ha sido aprobada y ahora tiene acceso al sistema de Mesa de Servicio del CTPI-CAUCA.<br><br>
                    Puede ingresar al sistema utilizando el siguiente enlace: <a href="http://mesadeservicioctpicauca.sena.edu.co">
                    Mesa de Servicio CTPI-CAUCA</a>.<br><br>
                    Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.<br><br>
                    Atentamente,<br>Equipo de Mesa de Servicio CTPI-CAUCA` 
                
            });


    } catch (error) {
        handleHttpError(res, "Error al aprobar técnico", 500);
    }         
}


// denegar tecnico
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

        transporter.sendMail({
            from: process.env.EMAIL,
            to: tecnico.correo,
            subject: 'Registro Denegado - Mesa de Servicio - CTPI-CAUCA',
                html: `Cordial saludo, ${tecnico.nombre}.<br><br>
                    Lamentamos informarle que su cuenta no ha sido aprobada, es posible que su registro este incompleto o
                    no cuente con los permisos para ingresar a: <a href="http://mesadeservicioctpicauca.sena.edu.co">
                    Mesa de Servicio CTPI-CAUCA</a>.<br><br>
                    Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.<br><br>
                    Atentamente,<br>Equipo de Mesa de Servicio CTPI-CAUCA` 
                
            });

        // Eliminar el usuario
        await usuarioModel.findByIdAndDelete(Id);

        res.send({ message: `tecnico  ${Id} ha sido denegado, eliminando sus datos de registro y su foto asociada` });
    } catch (error) {
        handleHttpError(res, "Error al eliminar el usuario", 500);
    }
};


// tecnicos aprobados
const listaTecnicosAprobados = async (req,res)=>{    
    try {
        const tecnicos = await usuarioModel.find({ rol: 'tecnico', estado: true })
        .select('nombre correo telefono');
                
        if(!tecnicos) {
            return res.status(500).send({message:" no hay tecnicos aprobados"})
        }
        res.status(200).json({message:"lista de tecnicos con registro aprobado", tecnicos})
        
    } catch (error) {
        handleHttpError(res, "Error al listar tecnicos con registro aprobado", 500);
        
    }
} 



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




module.exports = { getUsuarios, getPerfilUsuario, updateUsuarios, deleteUsuarios, getUsuariosId, listaTecnicosPendientes, aprobarTecnico, denegarTecnico, listaTecnicosAprobados };









 /*
populate es una función de Mongoose que se utiliza para reemplazar las referencias en un documento con los documentos a los que hacen referencia
 find() método de Mongoose que busca todos los documentos en la colección, La consulta {} indica que no hay filtros, por lo que se devuelven todos los documentos.
*/
//req.params es parte de Express.js y se utiliza para acceder a los parámetros de ruta en una solicitud HTTP (url).
//     const userId = req.usuario._id; // Obtener el ID del usuario autenticado
