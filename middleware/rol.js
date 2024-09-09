const {handleHttpError} = require ("../utils/handleError.js");


// array con los roles permitidos
const checkRol = (roles) => (req, res, next)=>{
    

    try {
        const {usuario} = req // establecido en session.js
        const rolesUsuario = usuario.rol
        // console.log({rolesUsuario})
        // console.log('Usuario autenticado:', req.usuario);


        const checkRolValido = roles.some((rolSingle) => rolesUsuario.includes(rolSingle) )
        if (!checkRolValido) {
            handleHttpError(res, "usuario no tiene los permisos", 403);
            return
        }
        next()
        
    } catch (error) {
        handleHttpError(res, "error con los permisos", 403);
    }

}

module.exports = checkRol

