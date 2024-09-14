const { usuarioModel, storageModel } = require("../models/index.js");
const { handleHttpError } = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL;
const fs = require('fs');
const path = require('path');
const transporter = require('../utils/handleEmail')
const { tokenSign } = require("../utils/handleJwt.js");






// tecnicos que requieren aprobacion
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



// aprobar tecnico 
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



module.exports = { listaTecnicosPendientes, aprobarTecnico, denegarTecnico, listaTecnicosAprobados };




//find siempre debe devolver un array,