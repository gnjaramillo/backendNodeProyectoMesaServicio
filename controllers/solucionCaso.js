const { solicitudModel, storageModel, usuarioModel, solucionCasoModel } = require("../models");
const { handleHttpError } = require("../utils/handleError");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const transporter = require("../utils/handleEmail");
// Importar socket.io
const { io } = require("../utils/handleSocket");




// Dar solución a la solicitud (caso)
const solucionCaso = async (req, res) => {
  const { id } = req.params; // id de la solicitud
  const { body } = req;
  const file = req.file;

  try {
    // Buscar solicitud por ID
    const solicitud = await solicitudModel.findById(id);
    if (!solicitud) {
      return res.status(404).send({ message: "Solicitud no encontrada" });
    }

    let fotoId;

    // Si se sube un archivo de evidencia, guardarlo
    if (file) {
      const fileData = {
        filename: file.filename,
        url: `${PUBLIC_URL}/${file.filename}`,
      };

      const fileSaved = await storageModel.create(fileData);
      fotoId = fileSaved._id;
    }

    const { tipoSolucion } = body;

    // Actualizar estado de la solicitud
    if (tipoSolucion === "pendiente") {
      solicitud.estado = "pendiente";
    } else if (tipoSolucion === "finalizado") {
      solicitud.estado = "finalizado";

      // Enviar correo de notificación si el estado es 'finalizado'
      const usuario = await usuarioModel.findById(solicitud.usuario);

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: usuario.correo,
        subject: "Caso Cerrado - Mesa de Servicio - CTPI-CAUCA",
        html: `
          <p>Cordial saludo, ${usuario.nombre},</p>
          <p>Nos permitimos informarle que su caso con código ${solicitud.codigoCaso} ha sido cerrado con éxito.</p>
          <p>Gracias por utilizar nuestro servicio de Mesa de Ayuda. Si tiene alguna otra solicitud, no dude en contactarnos.</p>
          <br>
          <p>Atentamente,</p>
          <p>Equipo de Mesa de Servicio - CTPI-CAUCA</p> `,
      });
    }


    // Guardar la solución del caso
    const datasolucion = {
      ...body,
      solicitud: solicitud._id,
      evidencia: fotoId, // solo si existe evidencia
    };

    // Enlazar la solución con la solicitud

    const solucionCaso = await solucionCasoModel.create(datasolucion);
    solicitud.solucion = solucionCaso._id


    // Guardar la solicitud
    await solicitud.save();


    // Emitir evento WebSocket para notificar a los clientes
    io.emit("actualizarSolicitud", {
      solicitudId: solicitud._id,
      estado: solicitud.estado,
    });

    const message =
      tipoSolucion === "finalizado"
        ? "Caso cerrado exitosamente"
        : "La solución del caso está pendiente y será resuelto próximamente.";

    return res.status(200).send({
      message,
      solucionCaso,
    });



  } catch (error) {
    console.error(error);
    return handleHttpError(res, "Error al registrar la solución del caso");
  }
};

module.exports = { solucionCaso };


