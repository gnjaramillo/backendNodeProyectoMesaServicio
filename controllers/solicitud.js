const { solicitudModel, storageModel, usuarioModel, ambienteModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const {postConsecutivoCaso} = require("../controllers/consecutivoCaso")
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const transporter = require('../utils/handleEmail');
// Importar socket.io
const { io } = require('../utils/handleSocket'); 



// ver solicitudes
const getSolicitud = async (req, res) => {
    try {
        const data = await solicitudModel.find({}).select('descripcion fecha estado codigoCaso')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('tecnico', 'nombre')
            .populate('foto', 'url')
            .populate({
                path: 'solucion',
                select: 'descripcionSolucion evidencia',
                populate: { path: 'evidencia', select: 'url' } // Traer también la evidencia si existe
            });
        

            res.status(200).json({ message: "solicitudes consultadas exitosamente", data });
        } catch (error) {
        handleHttpError(res, "error al obtener datos");
    }
};



// Historial de solicitudes vista líder
const getHistorialSolicitud = async (req, res) => {
    try {
        // Filtrar solicitudes cuyo estado no sea 'solicitado'
        const data = await solicitudModel.find({ estado: { $ne: 'solicitado' } })
            .select('descripcion fecha estado codigoCaso')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('tecnico', 'nombre')
            .populate('foto', 'url')
            .populate({
                path: 'solucion',
                select: 'descripcionSolucion',
            });

        res.status(200).json({ message: "Solicitudes consultadas exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al obtener datos");
    }
};




const getSolicitudId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await solicitudModel.findById(id).select('descripcion fecha estado')
        .populate('usuario', 'nombre')
        .populate('ambiente', 'nombre activo')
        .populate('tecnico', 'nombre')
        .populate('foto', 'url')
        .populate({
            path: 'solucion',
            select: 'descripcionSolucion evidencia',
            populate: { path: 'evidencia', select: 'url' } // Traer también la evidencia si existe
        });


        if (!data) {
            handleHttpError(res, "solicitud no encontrado");
            return;
        }

        res.status(200).json({ message: "solicitud consultado exitosamente", data });
        
    } catch (error) {
        handleHttpError(res, "Error al consultar el solicitud");
    }
};



const deleteSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await solicitudModel.findByIdAndDelete(id);
        
        if (!data) {
            return res.status(404).json({ error: "Solicitud no encontrada" });
        }

        res.status(200).json({ message: "Solicitud eliminada exitosamente", data });
        
    } catch (error) {
        console.error("Error al eliminar la solicitud:", error);
        res.status(500).json({ error: "Error al eliminar la solicitud" });
    }
};




// solicitudes realizadas por funcionarios, pendientes de ser asignadas (vista inicial lider)
const getSolicitudesPendientes = async (req, res) => {

    try {
        const data = await solicitudModel.find({ estado: 'solicitado' })
            .select('descripcion telefono fecha estado')        
            .populate('usuario', 'nombre correo')
            .populate('ambiente', 'nombre')
            .populate('foto', 'url');

        res.status(200).json({ data });
        
    } catch (error) {
        handleHttpError(res, "Error al obtener datos");
    }
};




// crear solicitud por funcionarios
const crearSolicitud = async (req, res) => {
    const { body } = req;
    const file = req.file;
    const usuarioId = req.usuario._id; // middleware de sesión con JWT
    
    try {
        // Validar si el ambiente asociado está activo
        const ambienteActivo = await ambienteModel.findOne({ _id: body.ambiente, activo: true });
        if (!ambienteActivo) {
            return handleHttpError(res, "El ambiente seleccionado no está activo o no existe", 400);
        }

        let fotoId;

        // Si hay un archivo adjunto, guárdalo y obtén su ID
        if (file) {
            const fileData = {
                filename: file.filename,
                url: `${PUBLIC_URL}/${file.filename}`
            };

            const fileSaved = await storageModel.create(fileData);
            fotoId = fileSaved._id;
        } else {
            console.log('No se subió ningún archivo.');
        }

        // Generar el código del caso usando el modelo Consecutivo
        const codigoCaso = await postConsecutivoCaso();

        const dataSolicitud = {
            ...body,
            usuario: usuarioId,
            foto: fotoId, // Solo incluye foto si existe
            codigoCaso: codigoCaso,
            estado: 'solicitado'
        };

        console.log('Datos de la solicitud:', dataSolicitud);

        const solicitudCreada = await solicitudModel.create(dataSolicitud); 
        res.status(201).send({ message: "Registro de solicitud exitoso", solicitud: solicitudCreada });

        // Enviar correo al funcionario 
        const usuario = await usuarioModel.findById(dataSolicitud.usuario);
        console.log('Usuario que registró la solicitud:', usuario);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: usuario.correo,
            subject: 'Registro Solicitud - Mesa de Servicio - CTPI-CAUCA',
            html: `Cordial saludo, ${usuario.nombre}, nos permitimos \
                informarle que su solicitud fue registrada en nuestro sistema con el número de caso \
                ${codigoCaso}. <br><br> Su caso será gestionado en el menor tiempo posible, \
                según los acuerdos de solución establecidos para la Mesa de Servicios del CTPI-CAUCA.\
                <br><br>Lo invitamos a ingresar a nuestro sistema en la siguiente url:\
                http://mesadeservicioctpicauca.sena.edu.co.`
        });
        console.log('Correo enviado a:', usuario.correo);

    } catch (error) {
        console.error('Error al registrar la solicitud:', error);
        handleHttpError(res, "Error al registrar solicitud");
    }
};



// historial solicitudes creadas por el funcionario
const historialSolicitudesCreadas = async (req, res) =>{
    const usuarioId = req.usuario._id; // middleware de sesión con JWT
    const usuario = await usuarioModel.findById({_id:usuarioId})

    try {
        const solicitudesFinalizadas = await solicitudModel
            .find({usuario: usuarioId, estado: 'finalizado' })
            .select('descripcion fecha estado')
            .populate('ambiente', 'nombre')
            .populate('tecnico', 'nombre')
            .populate('foto', 'url')
            .populate({
                path: 'solucion',
                select: 'descripcionSolucion',
            });
        

      // Respuesta con las solicitudes finalizadas
      res.status(200).json({
        message: `Historial Solicitudes finalizadas  ${usuario.nombre}`,
        solicitudesFinalizadas,
      });
        } catch (error) {
        handleHttpError(res, "error al obtener datos");
    }

}



// asignar tecnico a solicitud
const asignarTecnicoSolicitud = async (req, res) => {
    try {
        const { id } = req.params; //id solicitud
        const { tecnico } = req.body; 

        
        const solicitud = await solicitudModel.findById(id);
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        const tecnicoAsignado = await usuarioModel.findOne({ _id: tecnico, rol: 'tecnico', estado: true });
        if (!tecnicoAsignado) {
            return res.status(404).json({ message: 'Técnico no encontrado o no aprobado' });
        }

        // Asigna el técnico a la solicitud y guarda la operación
        solicitud.tecnico = tecnico;
        solicitud.estado = 'asignado';
        await solicitud.save();

        //------- Emitir evento para actualizar la vista del funcionario
        io.emit('actualizarSolicitud', { solicitudId: solicitud._id, estado: solicitud.estado });
        
       // Contar cuántas solicitudes tiene asignadas el técnico
       const solicitudesAsignadas = await solicitudModel.countDocuments({ tecnico: tecnico, estado: 'asignado' });

       //------- Emitir evento para actualizar el número de solicitudes asignadas al técnico en tiempo real
       io.emit('actualizarTecnico', { tecnicoId: tecnico, numeroSolicitudesAsignadas: solicitudesAsignadas });

        transporter.sendMail({
            from: process.env.EMAIL,
            to: tecnicoAsignado.correo,
            subject: 'Asignacion de caso - Mesa de Servicio - CTPI-CAUCA',
            html: `<p>Cordial saludo, ${tecnicoAsignado.nombre},</p>    
        <p>Nos permitimos informarle que le ha sido asignada la solicitud con el código de caso <strong>${solicitud.codigoCaso}</strong>.</p>
        <p>Esta solicitud ha sido asignada para su gestión según los acuerdos de servicio establecidos para la Mesa de Servicios del CTPI-CAUCA. Le agradecemos que revise los detalles de la solicitud y proceda con las acciones necesarias para su resolución.</p>
        <p>Para acceder al sistema y gestionar la solicitud, por favor ingrese a la siguiente dirección:</p>
        <p><a href="http://mesadeservicioctpicauca.sena.edu.co">http://mesadeservicioctpicauca.sena.edu.co</a></p>
        <p>Agradecemos su pronta atención a esta solicitud.</p>
        <p>Atentamente,<br>
        Equipo de Mesa de Servicios<br>
        CTPI-CAUCA</p>`
        });

        res.status(200).json({ message: 'Técnico asignado exitosamente', solicitud });
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar técnico', error: error.message });
    }
};




//solicitudes asignadas filtradas por cada tecnico
const getSolicitudesAsignadas = async (req,res) =>{

    try {
        const tecnicoId = req.usuario._id // middleware de sesión con JWT
        const tecnico = await usuarioModel.findById({_id:tecnicoId})


        const solicitudesAsignadas = await solicitudModel
            .find({tecnico: tecnicoId, estado:{$ne: 'finalizado'}}) // Excluir finalizadas, solo mostrar pendientes o asignadas
            .select('descripcion telefono fecha estado')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('foto', 'url');

        res.status(200).json({message:`solicitudes asignadas tecnico ${tecnico.nombre}`, solicitudesAsignadas });
        
    } catch (error) {
        handleHttpError(res, "Error al obtener datos");
    }
}




// historial solicitudes finalizadas vista técnico
const getSolicitudesFinalizadas = async (req, res) => {
    try {
      const tecnicoId = req.usuario._id; // middleware de sesión con JWT
      const tecnico = await usuarioModel.findById({_id:tecnicoId})
      
      // Filtra las solicitudes asignadas al técnico que estén en estado "finalizado"
      const solicitudesFinalizadas = await solicitudModel
        .find({ tecnico: tecnicoId, estado: 'finalizado' })
        .select('descripcion fecha codigoCaso') 
        .populate('usuario', 'nombre')
        .populate('ambiente', 'nombre')
        .populate('foto', 'url')
        .populate({
            path: 'solucion',
            select: 'descripcionSolucion evidencia',
            populate: { path: 'evidencia', select: 'url' } // Traer también la evidencia si existe
        });
        
  
      // Respuesta con las solicitudes finalizadas
      res.status(200).json({
        message: `Solicitudes finalizadas del técnico ${tecnico.nombre}`,
        solicitudesFinalizadas,
      });
    } catch (error) {
      handleHttpError(res, 'Error al obtener solicitudes finalizadas');
    }
  };
  

module.exports = { getSolicitud, getHistorialSolicitud, getSolicitudId, getSolicitudesPendientes, crearSolicitud, historialSolicitudesCreadas, asignarTecnicoSolicitud, getSolicitudesAsignadas,  getSolicitudesFinalizadas, deleteSolicitud };






  /*   Cambio clave: He modificado la consulta en la línea 
  .find({ tecnico: tecnicoId, estado: { $ne: 'finalizado' } }). 
  El operador $ne significa "no igual a", por lo que ahora solo 
  se traerán solicitudes cuyo estado no sea "finalizado". */