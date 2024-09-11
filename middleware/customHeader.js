const customHeader = (req, res, next) => {
    // Agrega los encabezados de CORS
    
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Cambia por la URL de tu frontend en producción si es necesario
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    next(); // Pasa al siguiente middleware o controlador
}

module.exports = customHeader;