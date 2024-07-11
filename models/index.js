const models = {
    ambientesModel: require('./ambienteFormacion'),
    casosModel: require('./caso'),
    centroFormacionModel: require('./centroFormacion'),
    centroFormacionUsuarioModel: require('./centroFormacionUsuarios'),
    regionalModel: require('./regional'),
    sedeSchema: require('./sede'),
    solicitudesModel: require('./solicitudes'),
    solucionCasoModel: require('./solucionCaso'),
    storageModel: require('./storage'),
    tipoCasoModel: require('./tipoCaso'),
    usuariosModel: require('./usuarios'),
}

module.exports = models