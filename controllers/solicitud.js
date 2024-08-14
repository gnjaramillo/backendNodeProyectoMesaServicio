const { solicitudModel, consecutivoCasoModel, casoModel, usuarioModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const {postConsecutivoCaso} = require("../controllers/consecutivoCaso")

const getSolicitud = async (req, res) => {
    try {
        const data = await solicitudModel.find({}).select('descripcion fecha')
            .populate('usuario', 'nombre')
            .populate('ambiente', 'nombre'); 
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
            .populate('ambiente', 'nombre'); 

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
    const { body } = req;

    try {
        const solicitudCreada = await solicitudModel.create(body);

        // Generar el código del caso usando el modelo Consecutivo
        const codigoCaso = await postConsecutivoCaso();

        // Crear un nuevo caso con el código generado
        const nuevoCaso = new casoModel({
            solicitud: solicitudCreada._id,
            codigoCaso: codigoCaso,
            estado: 'solicitado'
        });

        const liderTic = await usuarioModel.findOne({ rol: 'Lider TIC' });
        if (!liderTic) {
            return res.status(500).send({ message: "No existe Líder TIC disponible" });
        }

        // Guardar el nuevo caso en la base de datos
        const casoGuardado = await nuevoCaso.save();

        res.status(201).send({ solicitud: solicitudCreada, caso: casoGuardado });

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
