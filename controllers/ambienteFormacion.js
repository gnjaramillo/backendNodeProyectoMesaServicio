const{ambienteModel} = require("../models")
const {handleHttpError} = require("../utils/handleError")



const getAmbiente = async (req, res) => {
    try {
        const data = await ambienteModel.find({ activo: true });
        res.send({ data });
    } catch (error) {
        handleHttpError(res, "Error al obtener datos de ambiente de formación");
    }
}



const getAmbienteId = async (req, res) =>{
    try {
        const { id } = req.params;
        const data = await ambienteModel.findOne({ _id: id, activo: true });
        if (!data) {
            handleHttpError(res, "Ambiente de formación no encontrado", 404);
            return;
        }
        res.send({ message: "Ambiente de formación consultado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al consultar el ambiente de formación");
    }
}



const postAmbiente = async(req, res) => {
    const { body } = req;
    try {
        const data = await ambienteModel.create(body);
        res.send({ message: "Ambiente de formación registrado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al registrar el ambiente de formación");
    }
}



const updateAmbiente = async(req, res) => {
    const ambienteId = req.params.id;
    const { body } = req;

    try {
        const data = await ambienteModel.findOneAndUpdate(
            { _id: ambienteId, activo: true },
            { ...body },
            { new: true }
        );

        if (!data) {
            handleHttpError(res, "Ambiente de formación no encontrado", 404);
            return;
        }

        res.send({ message: `Ambiente de formación ${ambienteId} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "Error al actualizar el ambiente de formación");
    }
}



const deleteAmbiente = async(req, res) => {
    const ambienteId = req.params.id;

    try {
        // Actualizar el campo 'activo' a false en lugar de eliminar el documento
        const data = await ambienteModel.findOneAndUpdate(
            { _id: ambienteId },
            { activo: false },
            { new: true }
        );

        if (!data) {
            handleHttpError(res, "Ambiente de formación no encontrado", 404);
            return;
        }

        res.send({ message: `Ambiente de formación ${ambienteId} desactivado exitosamente`, data });

    } catch (error) {
        handleHttpError(res, "Error al desactivar el ambiente de formación");
    }
};



module.exports = { getAmbiente, getAmbienteId, postAmbiente, updateAmbiente, deleteAmbiente };



// permite saber quien hace la peticion
// const usuario = req.usuario