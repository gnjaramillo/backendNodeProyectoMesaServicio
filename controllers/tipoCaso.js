const {tipoCasoModel} = require("../models")
const {handleHttpError} = require("../utils/handleError")



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

const postTipoCaso= async(req, res)=>{
    const {body}=req;

    try {
        const data = await tipoCasoModel.create(body);
        res.send({message: "tipo de caso registrado exitosamente", data})        
    } catch (error) {
        handleHttpError(res, "Error al registrar el tipo de caso")
    }
}


const updateTipoCaso = async(req, res) =>{

    const Id = req.params.id;
    const {body} = req;

    try {
        let updateData = {...body};
        const data = await tipoCasoModel.findOneAndUpdate({_id: Id}, updateData, {new:true})
        res.send({message: `tipo de caso ${Id} actualizado exitosamente`, data})
    } catch (error) {
        handleHttpError(res, "error al actualizar tipo de caso")
        
    }
}


const deleteTipoCaso = async(req, res) => {
    const Id = req.params.id;
    try {
        const data = await tipoCasoModel.findByIdAndDelete({_id: Id})
        if (!data) {
            handleHttpError(res, "tipo de caso no encontrado", 404)
            return;
        }
        res.send({message:`tipo de caso ${Id} eliminado`})
    } catch (error) {
        handleHttpError(res, "Error al eliminar tipo de caso");
    }
}


module.exports ={getTipoCaso, getTipoCasoId, postTipoCaso, updateTipoCaso, deleteTipoCaso }