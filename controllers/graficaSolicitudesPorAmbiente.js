const { handleHttpError } = require("../utils/handleError");
const { solicitudModel } = require("../models");


const getSolicitudesPorAmbientes = async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    try {
        // Agregación para contar solicitudes por ambiente
        const data = await solicitudModel.aggregate([
            {
                $match: {
                    fecha: { $gte: start, $lt: end } // Filtra las solicitudes por el año seleccionado
                }
            },
            {
                $group: {
                    _id: "$ambiente", 
                    cantidad: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "ambientes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "ambiente"
                }
            },
            {
                $unwind: {
                    path: "$ambiente",
                    preserveNullAndEmptyArrays: true // Preserva documentos que no tienen un ambiente relacionado
                }
            },
            {
                $project: {
                    _id: 0,
                    nombre: { $ifNull: ["$ambiente.nombre", "Ambiente Eliminado"] }, // Nombre o "Ambiente Eliminado"
                    cantidad: "$cantidad",
                    activo: "$ambiente.activo" // Incluye el estado del ambiente
                }
            },
            {
                $sort: { cantidad: -1 } // Ordenar por la cantidad de solicitudes, de mayor a menor
            }
        ]);

        res.status(200).json({ message: "Datos obtenidos correctamente", data });
    } catch (error) {
        handleHttpError(res, "Error al obtener datos agregados por ambiente");
    }
};


module.exports = { getSolicitudesPorAmbientes };
