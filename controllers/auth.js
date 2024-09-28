const express = require("express");
const router = express.Router();
const { encrypt, compare } = require("../utils/handlePassword");
const { usuarioModel, storageModel } = require("../models"); // Asegúrate de importar todos los modelos necesarios
const { tokenSign } = require("../utils/handleJwt");
const {handleHttpError} = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const RENDER_URL = process.env.RENDER_URL 



const jwt = require("jsonwebtoken");
const isProduction = process.env.NODE_ENV === 'production';



const registerCtrl = async (req, res) => {
    try {
        const { password, confirmPassword, rol, correo, ...rest } = req.body;

        // Verificar si ya existe un usuario con el rol de "Lider TIC"
        if (rol === 'lider') {
            const liderExistente = await usuarioModel.findOne({ rol: 'lider' });
            if (liderExistente) {
                return res.status(400).send({ message: "Ya existe un usuario con el rol de Lider TIC. No se permiten múltiples registros con este rol." });
            }
        }

        const correoExiste = await usuarioModel.findOne({correo})
        if (correoExiste) {
            return res.status(400).send({ message: "correo ya se encuentra registrado" });
        }
        

        if (confirmPassword !== password) {
            return res.status(401).send({ message: "Las contraseñas no coinciden" });
        }

        
        const passwordHash = await encrypt(password);
        const body = { ...rest, password: passwordHash, rol, correo };

        
        // Buscar la foto por defecto en la colección storage
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

        const message = rol === 'tecnico' 
            ? "Usuario registrado exitosamente. Su cuenta está en espera de aprobación por el Líder TIC." 
            : "Usuario registrado exitosamente.";

            res.json({message, data });

    } catch (error) {
            return res.status(400).send({message:"correo ya se encuentra registrado"})              
    }
}


const loginCtrl = async (req, res) => {
    try {
        const { correo, password } = req.body;


        // Encontrar el usuario por su correo y seleccionar la contraseña
        const user = await usuarioModel.findOne({ correo }).select('password correo rol estado activo nombre').populate('foto', 'url')
       
        if (!user) {
            return handleHttpError(res, "usuario no existe", 404);
        }

        // Verificar si el usuario es Técnico y si su estado de registro es false
        if (user.rol === 'tecnico' && user.estado === false) {
            return res.status(403).send({ message: `Su registro se encuentra sujeto a aprobación
                por parte del Líder TIC. Una vez sea aprobado, podrá ingresar al sistema. ¡Gracias!` });
        }

        // ------------ Verificar si el usuario se encuentra activo
        if (user.activo === false) {
            return res.status(403).send({ message: `En el momento su ingreso se encuentra inactivado
                por parte del Líder TIC. Una vez sea reactivado, podrá ingresar al sistema. ¡Gracias!` });
        }



        // Comparar la contraseña ingresada con la almacenada
        const passwordSave = user.password;
        const check = await compare(password, passwordSave);



        if (!check) {
            return handleHttpError(res, "contraseña incorrecta", 401);
        }

        // Si todo está bien, se devuelve el token de sesión y la data del usuario
        user.set('password', undefined, {strict:false}) // oculta contraseña
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

      /*   res.cookie('token', token, {
            httpOnly: true, // Hace que la cookie no sea accesible mediante JavaScript en el cliente
            secure: isProduction, // Usa 'Secure' solo si está en producción (es decir, en HTTPS) contexto donde el frontend está ejecutando la solicitud.
            sameSite: isProduction ? 'None' : 'Lax', // En producción usa 'None', en desarrollo puedes usar 'Lax'
          }); */

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

/*     const verifyToken = async (req, res) => {
        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Sin autorización o formato de token incorrecto' });
        }
    
        const token = authHeader.split(' ')[1]; // Extraer el token
    
        try {
            const user = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return reject('Token inválido o expirado');
                    }
                    resolve(decoded);
                });
            });
    
            const foundUser = await usuarioModel.findOne({ _id: user._id });
            if (!foundUser) {
                return res.status(400).json({ message: 'Usuario no encontrado' });
            }
    
            return res.status(200).json(foundUser);
        } catch (error) {
            res.status(500).json({
                message: 'Error al verificar el token',
                error: error,
            });
        }
    };
    
 */

const createLogout =  (req, res) => {

    try {
        
        res.cookie("token", "", {
            expires: new Date(0)
        });
        res.status(200).json({message: "Sesion cerrada exitosamente!"});

    } catch (error) {
        res.status(500).json({
            message: 'Error al cerrar la sesion',
            error: error.message
        });
    }

} 

/*     const createLogout = (req, res) => {
        try {
            // No es necesario modificar ninguna cookie ya que estás usando localStorage para el token
            res.status(200).json({message: "Sesión cerrada exitosamente!"});
        } catch (error) {
            res.status(500).json({
                message: 'Error al cerrar la sesión',
                error: error.message
            });
        }
    }
    
 */

module.exports = { registerCtrl, loginCtrl, verifyToken, createLogout };




/* undefined a la propiedad password es útil para evitar 
que la contraseña sea incluida en las respuestas HTTP o se registre 
en los logs.  { strict: false } permite esta modificación, incluso si el 
esquema de Mongoose tiene restricciones estrictas. */


/* El error de clave duplicada en MongoDB genera un código 
de error 11000. */
