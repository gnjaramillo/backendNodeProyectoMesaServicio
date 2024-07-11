const {tipoCasoModel} = require("../models")
const {handleHttpError} = require("../utils/handleError")


module.exports = { getTipoCaso, getTipoCasoId, postTipoCaso, updateTipoCaso, deleteTipoCaso };

const getTipoCaso= async (req,res)=>{
    try {        
        const data = await tipoCasoModel.find({})
        res.send({data})
    } catch (error) {
        handleHttpError(res, "error al obtener datos");
    }
}

const getTipoCasoId = async(req, res)=>{
    try {
        const {id} = req.params;
        const data = await tipoCasoModel.findById(id)
        if (!data) {
            handleHttpError(res, "tipo de caso no encontrado");
            return
        }
        res.send({message: "tipo de caso consultado exitosamente", data})
        
    } catch (error) {
        handleHttpError(res, "Error al consultar el tipo de caso")
    }
}