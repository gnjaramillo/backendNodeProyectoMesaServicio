/* const { consecutivoCasoModel } = require("../models");
const { DateTime } = require("luxon");



const postConsecutivoCaso = async () => {
    try {
        const currentYearMonth = DateTime.now().toFormat("yyyy-MM");

        // Buscar el consecutivo correspondiente al año y mes actuales
        let consecutivo = await consecutivoCasoModel.findOne({ yearMonth: currentYearMonth });

        // Si no existe, creamos uno nuevo con la secuencia iniciada en 0
        if (!consecutivo) {
            consecutivo = new consecutivoCasoModel({
                yearMonth: currentYearMonth,
                sequence: 0
            });
        }

        consecutivo.sequence += 1;
        await consecutivo.save();

        // Formatear el consecutivo a 5 dígitos, e.g., "00001"
        const consecutivoFormateado = consecutivo.sequence.toString().padStart(5, '0');

        const codigoCaso = `${currentYearMonth}-${consecutivoFormateado}`;
        return codigoCaso;

    } catch (error) {
        throw new Error("Error al generar el código del caso");
    }
};

module.exports = { postConsecutivoCaso };
 */