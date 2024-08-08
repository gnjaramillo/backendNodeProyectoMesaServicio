const { solicitudModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

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


const postSolicitud = async (req, res) => {
    const { body } = req;
    try {
        const data = await solicitudModel.create(body);
        res.send({ message: "solicitud registrado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al registrar el solicitud");
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

module.exports = { getSolicitud, getSolicitudId, postSolicitud, updateSolicitud, deleteSolicitud };
