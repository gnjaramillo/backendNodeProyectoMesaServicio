


const { solicitudModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

const getSolicitudesPorMes = async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    try {
        const data = await solicitudModel.aggregate([
            {
                $match: {
                    fecha: { $gte: start, $lt: end } // Filtra las solicitudes por el año seleccionado
                }
            },
            {
                $group: {
                    _id: { $month: "$fecha" },
                    cantidad: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.status(200).json({ message: "Datos obtenidos correctamente", data });
    } catch (error) {
        handleHttpError(res, "Error al obtener datos agregados por mes");
    }
};

module.exports = { getSolicitudesPorMes };
