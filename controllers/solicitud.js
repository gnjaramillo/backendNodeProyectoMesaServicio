const { solicitudModel, storageModel, casoModel, usuarioModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const {postConsecutivoCaso} = require("../controllers/consecutivoCaso")
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const transporter = require('../utils/handleEmail')


//http://localhost:3010/api/solicitud/

const getSolicitud = async (req, res) => {
    try {
        const data = await solicitudModel.find({}).select('descripcion fecha')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('foto')

        res.send({ data });
        console.log(data)
    } catch (error) {
        handleHttpError(res, "error al obtener datos");
    }
};


const getSolicitudId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await solicitudModel.findById(id).select('descripcion fecha')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre')
            .populate('foto'); 
            
        if (!data) {
            handleHttpError(res, "solicitud no encontrado");
            return;
        }
        res.send({ message: "solicitud consultado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al consultar el solicitud");
    }
};




const crearSolicitud = async (req, res) => {
    try {
        const { body } = req;
        const file = req.file;
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

        // Incluir la evidencia en la solicitud solo si se subió una foto
        const dataSolicitud = {
            ...body,
            foto: fotoId // Solo incluye foto si existe
        };

        const solicitudCreada = await solicitudModel.create(dataSolicitud);

        // Generar el código del caso usando el modelo Consecutivo
        const codigoCaso = await postConsecutivoCaso();

        // Crear un nuevo caso con el código generado
        const nuevoCaso = new casoModel({
            solicitud: solicitudCreada._id,
            codigoCaso: codigoCaso,
            estado: 'solicitado'
        });

        const liderTic = await usuarioModel.findOne({ rol: 'lider' });
        if (!liderTic) {
            return res.status(500).send({ message: "No existe Líder TIC disponible" });
        }

        // Guardar el nuevo caso en la base de datos
        const casoGuardado = await nuevoCaso.save();

        res.status(201).send({  message:"registro de solicitud exitosa", solicitud: solicitudCreada, caso: casoGuardado });


        //enviar correo al funcionario que registro la solicitud, busco el funcionario asociado

        const usuario = await usuarioModel.findById(dataSolicitud.usuario)

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
        console.error(error);
        handleHttpError(res, "Error al registrar solicitud");
    }
};



const updateSolicitud = async (req, res) => {
    const Id = req.params.id;
    const { body } = req;

    try {
        const data = await solicitudModel.findOneAndUpdate({ _id: Id }, body, { new: true });
        res.send({ message: `solicitud ${Id} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "error al actualizar solicitud");
    }
};



const deleteSolicitud = async (req, res) => {
    const Id = req.params.id;
    try {
        const data = await solicitudModel.findByIdAndDelete({ _id: Id });
        if (!data) {
            handleHttpError(res, "solicitud no encontrado", 404);
            return;
        }
        res.send({ message: `solicitud ${Id} eliminado` });
    } catch (error) {
        handleHttpError(res, "Error al eliminar solicitud");
    }
};

module.exports = { getSolicitud, getSolicitudId, crearSolicitud, updateSolicitud, deleteSolicitud };
