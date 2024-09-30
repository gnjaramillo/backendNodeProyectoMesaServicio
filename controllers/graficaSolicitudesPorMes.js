const { solicitudModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");

const getSolicitudesPorMes = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  try {
    // Agregación para obtener el total de solicitudes por mes
    const data = await solicitudModel.aggregate([
      {
        $match: {
          fecha: { $gte: start, $lt: end }, // Filtra las solicitudes por el año seleccionado
        },
      },
      {
        $group: {
          _id: { $month: "$fecha" }, // Agrupa por mes
          cantidad: { $sum: 1 }, // Suma la cantidad de solicitudes por mes
        },
      },
      {
        $sort: { _id: 1 }, // Ordena los resultados por mes
      },
    ]);

    // Agregación para obtener el total de solicitudes en el año
    const totalSolicitudes = await solicitudModel.countDocuments({
      fecha: { $gte: start, $lt: end },
    });

    // Responder con los datos de la gráfica y el total de solicitudes
    res
      .status(200)
      .json({
        message: "Datos obtenidos correctamente",
        data,
        totalSolicitudes,
      });
  } catch (error) {
    handleHttpError(res, "Error al obtener datos agregados por mes");
  }
};

module.exports = { getSolicitudesPorMes };
