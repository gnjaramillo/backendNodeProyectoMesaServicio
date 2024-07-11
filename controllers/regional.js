const {regionalModel} = require("../models")
const {handleHttpError} = require("../utils/handleError")

const getRegional= async (req, res) => {
    try {
        const data = await regionalModel.find({})
        res.send({data})

    } catch (error) {
        handleHttpError(res, "error al obtener datos de regional");
    }
}



const getRegionalId = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await regionalModel.findById(id)
        if (!data) {
            handleHttpError(res, "Regional no encontrada", 404);
            return;
        }
        res.send({message: "regional consultada exitosamente", data})
    } catch (error) {
        handleHttpError(res, "Error al consultar la regional")
    }
}



const postRegional = async (req, res) => {
    const {body} = req
    try {  
        const data ={
            ...body
        }
        const dataRegional = await regionalModel.create(data);
        console.log(data)
        res.send({message: "Regional registrada exitosamente", dataRegional})
    } catch (error) {
        handleHttpError(res, "Error al registrar la regional")
    }
}



const updateRegional = async (req, res) => {
    const regionalId = req.params.id;
    const { body } = req;

    try {
        let updateData = { ...body };  
        const data = await regionalModel.findOneAndUpdate({ _id: regionalId }, updateData, { new: true });
        console.log(updateData)

        if (!data) {
            handleHttpError(res, "Regional no encontrada", 404);
            return;
        }

        res.send({ message: `Regional ${regionalId} actualizada exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "Error al actualizar la regional");
    }
};





const deleteRegional = async (req, res) => {
    const regionalId = req.params.id;

    try {
        const data = await regionalModel.findOneAndDelete({_id: regionalId})
        if (!data) {
            handleHttpError(res, "Regional no encontrada", 404);
            return;
        }
        res.send({ message: `regional ${regionalId} eliminado` });
    } catch (error) {
        handleHttpError(res, "Error al eliminar la regional")
    }
}



module.exports = { getRegional, getRegionalId, postRegional, updateRegional, deleteRegional };
