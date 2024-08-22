const{ambienteModel} = require("../models")
const {handleHttpError} = require("../utils/handleError")


const getAmbiente = async (req, res) => {
    try {
        // la const usuario me permite saber quien hace la peticion
        const usuario = req.usuario
        const data = await ambienteModel.find({})
        res.send({data, usuario})    

    } catch (error) {
        handleHttpError(res, "error al obtener datos de ambiente de formación")
    }
}


const getAmbienteId = async (req, res) =>{
    try {
        const {id} =req.params;
        const data = await ambienteModel.findById(id)
        if (!data) {
            handleHttpError(res, "ambiente de formación no encontrado")
            return;            
        }
        res.send({message: "ambiente de formación consultado exitosamente ", data})
    } catch (error) {
        handleHttpError(res, "error al consultar la ambiente de formación")        
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


const updateAmbiente = async(req, res)=>{
    const ambienteId = req.params.id;
    const {body} = req;

    try {
        let updateData={...body};
        const data = await ambienteModel.findOneAndUpdate({_id:ambienteId}, updateData, { new: true });
        console.log(updateData)

        if (!data) {
            handleHttpError(res, "ambiente de formación no encontrado", 404);
            return;
        }    

        res.send({ message: `ambiente de formación ${ambienteId} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "Error al actualizar");
    }

}


const deleteAmbiente = async(req, res) =>{
    const ambienteId = req.params.id;

    try {
        const data = await ambienteModel.findOneAndDelete({_id:ambienteId})
        if (!data) {
            handleHttpError(res, "ambiente de formación no encontrado", 404);
            return;
            
        }
        res.send({ message: `ambiente de formación ${ambienteId} eliminado` });

    } catch (error) {
        handleHttpError(res, "Error al actualizar");
    }

}


module.exports = { getAmbiente, getAmbienteId, postAmbiente, updateAmbiente, deleteAmbiente };
