const bcryptjs = require("bcryptjs")

const encrypt = async (passwordPlain) => {
    // version encriptada de la contraseña
    const hash = await bcryptjs.hash(passwordPlain, 10)
    return hash
};


const compare = async (passwordPlain, hashPassword) => {
    // compara contraseña encriptada y almanecenada en la BD con la ingresada al iniciar sesion
    return await bcryptjs.compare(passwordPlain, hashPassword)
};


module.exports = {encrypt, compare }