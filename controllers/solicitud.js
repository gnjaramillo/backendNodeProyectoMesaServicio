const { solicitudModel, storageModel, usuarioModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const { postConsecutivoCaso } = require("../controllers/consecutivoCaso");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const transporter = require('../utils/handleEmail');




const getSolicitud = async (req, res) => {
    try {
        const data = await solicitudModel.find({})
            .select('descripcion fecha estado')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('tecnico', 'nombre')
            .populate('foto', 'url filename')

            res.status(200).json({ message: "solicitud consultado exitosamente", data });
        } catch (error) {
        handleHttpError(res, "error al obtener datos");
    }
};

const getSolicitudId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await solicitudModel.findById(id).select('descripcion fecha estado')
        .populate('usuario', 'nombre')
        .populate('ambiente', 'nombre')
        .populate('tecnico', 'nombre')
        .populate('foto', 'url'); 
        
        if (!data) {
            handleHttpError(res, "solicitud no encontrado");
            return;
        }

        res.status(200).json({ message: "solicitud consultado exitosamente", data });
        
    } catch (error) {
        handleHttpError(res, "Error al consultar el solicitud");
    }
};



// solicitudes realizadas por funcionarios, pendientes de ser asignadas 
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



// solicitudes realizadas por funcionarios
const crearSolicitud = async (req, res) => {

    const { body } = req;
    const file = req.file;
    const usuarioId = req.usuario._id; // lo trae el middleware de sesion con jwt
    
    try {
        let fotoId;

        // Si hay un archivo adjunto, guárdalo y obtén su ID
        if (file) {
            const fileData = {
                filename: file.filename,
                url: `${PUBLIC_URL}/${file.filename}`
            };

            console.log(fileData);

            const fileSaved = await storageModel.create(fileData);
            fotoId = fileSaved._id;
        }

        // Generar el código del caso usando el modelo Consecutivo
        const codigoCaso = await postConsecutivoCaso();

        // Incluir la evidencia en la solicitud solo si se subió una foto
        const dataSolicitud = {
            ...body,
            usuario: usuarioId,
            foto: fotoId, // Solo incluye foto si existe
            codigoCaso: codigoCaso,
            estado: 'solicitado'
        };

        const solicitudCreada = await solicitudModel.create(dataSolicitud); 

        res.status(201).send({  message:"registro de solicitud exitosa", solicitud: solicitudCreada });


        // enviar correo al funcionario que registro la solicitud, busco el funcionario asociado
        const usuario = await usuarioModel.findById(dataSolicitud.usuario);

        transporter.sendMail({
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
    } catch (error) {
        handleHttpError(res, "Error al registrar solicitud");
    }
};


// asignar tecnico a solicitud
const asignarTecnicoSolicitud = async (req, res) => {
    try {
        const { id } = req.params; //id solicitud
        const { tecnico } = req.body; 

        
        const solicitud = await solicitudModel.findById(id);
        if (!solicitud) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        const tecnicoaprobado = await usuarioModel.findOne({ _id: tecnico, rol: 'tecnico', estado: true });
        if (!tecnicoaprobado) {
            return res.status(404).json({ message: 'Técnico no encontrado o no aprobado' });
        }

        // Asigna el técnico a la solicitud y guarda la operación
        solicitud.tecnico = tecnico;
        solicitud.estado = 'asignado';
        await solicitud.save();


        const tecnicoAsignado = await usuarioModel.findById(solicitud.tecnico)

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
        const tecnicoId = req.usuario._id 
        const tecnico = await usuarioModel.findById({_id:tecnicoId})


        const solicitudesAsignadas = await solicitudModel.find({tecnico: tecnicoId})
            .select('descripcion telefono fecha estado')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('foto', 'url');

        res.status(200).json({message:`solicitudes asignadas tecnico ${tecnico.nombre}`, solicitudesAsignadas });
        
    } catch (error) {
        handleHttpError(res, "Error al obtener datos");
    }
}





module.exports = { getSolicitud, getSolicitudId,getSolicitudesPendientes, crearSolicitud, asignarTecnicoSolicitud, getSolicitudesAsignadas };


/* if (tipoSolucion === 'pendiente' && !fotoId) {
    return res.status(400).json({ message: 'Se requiere evidencia para establecer una solución pendiente' });

} else if (tipoSolucion === 'pendiente' && fotoId) {
    solicitud.estado = 'pendiente';
    await solicitud.save();

} else if (tipoSolucion === 'finalizado') {
    solicitud.estado = 'finalizado';
    await solicitud.save();
 */
