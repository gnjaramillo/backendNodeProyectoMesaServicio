const {consecutivoCasoModel} = require("../models")

const postConsecutivoCaso = async () => {
    try {
        const currentYear = new Date().getFullYear();
        let consecutivo = await consecutivoCasoModel.findOne({ year: currentYear });

        if (!consecutivo) {
            consecutivo = new consecutivoCasoModel({
                year: currentYear,
                sequence: 0
            });
        }

        consecutivo.sequence += 1;
        await consecutivo.save();

        // Formatear el consecutivo a 5 dígitos, e.g., "00001"
        const consecutivoFormateado = consecutivo.sequence.toString().padStart(5, '0');

        // Generar el código del caso
        const codigoCaso = `${currentYear}-${consecutivoFormateado}`;
        return codigoCaso;

    } catch (error) {
        throw new Error("Error al generar el código del caso");
    }
};



module.exports = {postConsecutivoCaso }
