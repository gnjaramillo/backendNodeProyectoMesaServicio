const {handleHttpError} = require("../utils/handleError")
const {verifyToken} = require("../utils/handleJwt")

const authMiddleware = async (req, res, next) => {
    try {
        // capturar el token de la base de datos

        if (!req.headers.authorization) {
            handleHttpError(res, "error en inicio de sesion", 401);
            return
        }
        
        const token = req.headers.authorization.split(" ").pop()
        const dataToken = await verifyToken(token)

        if (!dataToken._id) {
            handleHttpError(res, "error en inicio de sesion", 401);
            return
        }

        next()

        
    } catch (error) {
        return handleHttpError(res, "error en inicio de sesion", 401);
    }
    
}
module.exports = authMiddleware


/* req.headers.authorization.split(" ").pop() es para omitir la palabra 
bearer que es un Estándar de Autenticación jwt,
"Bearer" es el esquema de autenticación que especifica que el token 
es un portador, lo que significa que se debe incluir el token 
en el encabezado de autorización de la solicitud HTTP. */