const express = require("express");
const router = express.Router();
const { encrypt, compare } = require("../utils/handlePassword");
const { usuarioModel, storageModel } = require("../models"); // Asegúrate de importar todos los modelos necesarios
const { tokenSign } = require("../utils/handleJwt");
const {handleHttpError} = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const jwt = require("jsonwebtoken");



// registrar el usuario http://localhost:3010/api/auth/register

const registerCtrl = async (req, res) => {
    try {
        const { password, confirmPassword, rol, ...rest } = req.body;
        console.log("Rol recibido:", rol);

        // Verificar si ya existe un usuario con el rol de "Lider TIC"
        if (rol === 'Lider TIC') {
            const liderExistente = await usuarioModel.findOne({ rol: 'Lider TIC' });
            if (liderExistente) {
                return res.status(400).send({ message: "Ya existe un usuario con el rol de Lider TIC. No se permiten múltiples registros con este rol." });
            }
        }

        if (confirmPassword !== password) {
            return res.status(400).send({ message: "Las contraseñas no coinciden" });
        }

        
        const passwordHash = await encrypt(password);
        const body = { ...rest, password: passwordHash, confirmPassword, rol };

           

            // Buscar o guardar la foto por defecto en la colección storage
        let fileSaved = await storageModel.findOne({ filename: 'usuario-undefined.png' });
        if (!fileSaved) {
                return res.status(500).send({message: "foto predeterminada no encontrada"})
        }
                            
        // Crear usuario incluyendo foto
        const userData = {
            ...body,
            foto: fileSaved._id
        };

        const dataUser = await usuarioModel.create(userData);
        dataUser.password = undefined; // Ocultar la contraseña en la respuesta




        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        };

        const message = rol === 'Tecnico' 
            ? "Usuario registrado exitosamente. Su cuenta está en espera de aprobación por el Líder TIC." 
            : "Usuario registrado exitosamente.";

        res.json({message, data });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern  && error.keyPattern.correo) {
            return res.status(400).send({message:"correo ya se encuentra registrado"})
        }else{
            handleHttpError(res, "error al registrar el usuario");
            
        }       
    }
}


// loguear el usuario http://localhost:3010/api/auth/login
const loginCtrl = async (req, res) => {
    try {
        const { correo, password } = req.body;

        console.log(correo)
        // Encontrar el usuario por su correo y seleccionar la contraseña
        const user = await usuarioModel.findOne({ correo });
        if (!user) return handleHttpError(res, "usuario no existe", 404);
       
        console.log(user)

        // Verificar si el usuario es Técnico y si su estado es false
        /*
        if (user.rol === 'Tecnico' && user.estado === false) {
            return res.status(403).send({ message: `Su registro se encuentra sujeto a aprobación
                por parte del Líder TIC. Una vez sea aprobado, podrá ingresar al sistema. ¡Gracias!` });
        }
        */


        

        // Comparar la contraseña proporcionada con la almacenada
        const passwordSave = user.password;
        const check = await compare(password, passwordSave);

        console.log("password recibido:", password);
        console.log("Password almacenada:", passwordSave);


        if (!check) {
            return handleHttpError(res, "contraseña incorrecta", 401);
        }

        // Si todo está bien, se devuelve el token de sesión y la data del usuario
        user.set('password', undefined, {strict:false}) // para q no devuelva la contraseña
        const token = await tokenSign(user);
        const dataUser = {
            token,
            user
        };
        
        res.cookie("token", token, {
            secure: true,
            sameSite: "none",
            httpOnly: false
        });

        res.json({  message: "Usuario ha ingresado exitosamente", dataUser});
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el usuario.",
            error: error.message
        })
        // handleHttpError(res, "error login usuario");
    }
};


const verifyToken = async (req, res) => {

    const { token } = req.cookies;

    try {

        if(!token) return res.status(400).json({message: "Sin autorizacion"});

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if(err) return res.status(400).json({message:err});

            const foundUser = await usuarioModel.findOne({_id: user._id});
            if (!foundUser) return res.status(400).json({message: "Usuario no encontrado."});
            
            return res.status(200).json(foundUser);
            
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Error al verificar el token",
            error: error.message
        });
    }
}



module.exports = {registerCtrl, loginCtrl, verifyToken }



/* undefined a la propiedad password del objeto user. 
Esto efectivamente elimina la propiedad password del objeto en memoria 
(no en la base de datos). Uso común: Esto es útil para evitar 
que la contraseña sea incluida en las respuestas HTTP o se registre 
en los logs.  { strict: false } permite esta modificación incluso si el 
esquema de Mongoose tiene restricciones estrictas.
 */


/* El error de clave duplicada en MongoDB genera un código 
de error 11000. Usamos este código para identificar que el 
error se debe a un intento de insertar un correo electrónico 
que ya existe en la base de datos.
 */


/* error.keyPattern:

keyPattern es una propiedad del objeto de error que contiene un objeto 
con los campos que causaron la violación de la unicidad. Por ejemplo, 
si intentas insertar un correo electrónico duplicado, keyPattern 
contendrá una propiedad llamada correo.
error.keyPattern.correo:

error.keyPattern.correo es una verificación adicional para asegurarse 
de que el campo específico que causó el error de duplicación 
sea el correo electrónico. Si keyPattern contiene una propiedad 
correo, significa que la violación de unicidad ocurrió en ese campo 
específico.
 */
