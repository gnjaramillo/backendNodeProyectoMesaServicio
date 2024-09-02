const { solicitudModel, storageModel, usuarioModel, solucionCasoModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const transporter = require('../utils/handleEmail');




// dar solucion a solicitud (caso)
const solucionCaso = async (req, res) => {
    const { id } = req.params; // id de la solicitud
    const { body } = req;
    const file = req.file;

    try {
        const solicitud = await solicitudModel.findById(id);
        if (!solicitud) {
            return res.status(404).send({ message: 'Solicitud no encontrada' });
        }

        let fotoId;

        if (file) {
            const fileData = {
                filename: file.filename,
                url: `${PUBLIC_URL}/${file.filename}`
            };
            
            console.log(fileData);
            
            const fileSaved = await storageModel.create(fileData);
            fotoId = fileSaved._id;
        }
        
        const { tipoSolucion } = body;
        
        if (tipoSolucion === 'pendiente') {
            solicitud.estado = 'pendiente';
            await solicitud.save();

        } else if (tipoSolucion === 'finalizado') {
            solicitud.estado = 'finalizado';
            await solicitud.save();

            // Enviar correo de notificación si el estado es 'finalizado'
            const usuario = await usuarioModel.findById(solicitud.usuario); 

            await transporter.sendMail({
                from: process.env.EMAIL,
                to: usuario.correo,
                subject: 'Caso Cerrado - Mesa de Servicio - CTPI-CAUCA',
                html: `
                    <p>Cordial saludo, ${usuario.nombre},</p>
                    <p>Nos permitimos informarle que su caso con código ${solicitud.codigoCaso} ha sido cerrado con éxito.</p>
                    <p>Gracias por utilizar nuestro servicio de Mesa de Ayuda. Si tiene alguna otra solicitud, no dude en contactarnos.</p>
                    <br>
                    <p>Atentamente,</p>
                    <p>Equipo de Mesa de Servicio - CTPI-CAUCA</p> `
            });

            return res.status(200).send({ message: "Caso cerrado exitosamente" });
        }

        // Guardar la solicitud y registrar la solución
        await solicitud.save();

        const datasolucion = {
            ...body,
            solicitud: solicitud._id,
            evidencia: fotoId
        };

        const solucionCaso = await solucionCasoModel.create(datasolucion);
        return res.status(201).send({ message: "Registro exitoso de la solución del caso", solucionCaso });

    } catch (error) {
        console.error(error);
        return handleHttpError(res, "Error al registrar la solución del caso");
    }
};



module.exports = {  solucionCaso };
