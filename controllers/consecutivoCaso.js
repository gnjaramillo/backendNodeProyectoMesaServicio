
const { consecutivoCasoModel } = require("../models");

const postConsecutivoCaso = async () => {
    try {
        // Obtener año y mes actuales en formato "YYYY-MM"
        const currentYearMonth = new Date().toISOString().slice(0, 7);

        // Buscar el consecutivo correspondiente al año y mes actuales
        let consecutivo = await consecutivoCasoModel.findOne({ yearMonth: currentYearMonth });

        // Si no existe, creamos uno nuevo con la secuencia iniciada en 0
        if (!consecutivo) {
            consecutivo = new consecutivoCasoModel({
                yearMonth: currentYearMonth,
                sequence: 0
            });
        }

        // Incrementar la secuencia
        consecutivo.sequence += 1;
        await consecutivo.save();

        // Formatear el consecutivo a 5 dígitos, e.g., "00001"
        const consecutivoFormateado = consecutivo.sequence.toString().padStart(5, '0');

        // Generar el código del caso con "YYYY-MM-XXXXX"
        const codigoCaso = `${currentYearMonth}-${consecutivoFormateado}`;
        return codigoCaso;

    } catch (error) {
        throw new Error("Error al generar el código del caso");
    }
};

module.exports = { postConsecutivoCaso };

