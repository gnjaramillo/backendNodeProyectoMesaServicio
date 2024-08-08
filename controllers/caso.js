const { casoModel, storageModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const PUBLIC_URL = process.env.PUBLIC_URL;

const getCaso = async (req, res) => {
    try {
        const data = await casoModel.find({})
            .populate({
                path: 'solicitud',
                select: 'usuario descripcion fechaDeRegistro',
                populate: [
                    { path: 'usuario', select: 'nombre' },
                    { path: 'ambiente', select: 'nombre' }
                ]
            });
        res.send({ data });
    } catch (error) {
        console.error(error);
        handleHttpError(res, "error al obtener datos");
    }
};




const getCasoId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await casoModel.findById(id)
            .populate({
                path: 'solicitud',
                select: 'usuario descripcion fechaDeRegistro',
                populate: [
                    { path: 'usuario', select: 'nombre' },
                    { path: 'ambiente', select: 'nombre' }
            ]
        });

        if (!data) {
            handleHttpError(res, "Caso no encontrado");
            return;
        }
        res.send({ message: "Caso consultado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al consultar el Caso");
    }
}

const postCaso = async (req, res) => {
    try {
        const { body } = req;
        const file = req.file;
        let fotoEvidenciaId;

        if (body.estado === 'pendiente' && !file) {
            handleHttpError(res, "Evidencia es requerida cuando el estado es pendiente", 400);
            return;
        }

        if (file) {
            const fileData = {
                url: `${PUBLIC_URL}/${file.filename}`,
                filename: file.filename
            };

            console.log(fileData);

            const fileSaved = await storageModel.create(fileData);
            fotoEvidenciaId = fileSaved._id;
        }

        const casoData = {
            ...body,
            evidencia: fotoEvidenciaId
        };

        const data = await casoModel.create(casoData);
        console.log(data)

        res.send({ message: "Caso registrado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al registrar el Caso");
    }
}

const updateCaso = async (req, res) => {
    const Id = req.params.id;
    const { body } = req;
    try {
        const data = await casoModel.findOneAndUpdate({ _id: Id }, body, { new: true });
        res.send({ message: `Caso ${Id} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "error al actualizar Caso");
    }
}

const deleteCaso = async (req, res) => {
    const Id = req.params.id;
    try {
        const data = await casoModel.findByIdAndDelete({ _id: Id });
        if (!data) {
            handleHttpError(res, "Caso no encontrado", 404);
            return;
        }
        res.send({ message: `Caso ${Id} eliminado` });
    } catch (error) {
        handleHttpError(res, "Error al eliminar Caso");
    }
}

module.exports = { getCaso, getCasoId, postCaso, updateCaso, deleteCaso };
