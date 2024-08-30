const express = require("express");
const router = express.Router();
const { encrypt, compare } = require("../utils/handlePassword");
const { usuarioModel, storageModel } = require("../models"); // Asegúrate de importar todos los modelos necesarios
const { tokenSign } = require("../utils/handleJwt");
const {handleHttpError} = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";
const jwt = require("jsonwebtoken");


// http://localhost:3010/api/auth/register
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


// http://localhost:3010/api/auth/login
const loginCtrl = async (req, res) => {
    try {
        const { correo, password } = req.body;


        // Encontrar el usuario por su correo y seleccionar la contraseña
        const user = await usuarioModel.findOne({ correo }).select('password correo rol estado').populate('foto', 'url')
       
        if (!user) {
            return handleHttpError(res, "usuario no existe", 404);
        }

        // Verificar si el usuario es Técnico y si su estado es false
        if (user.rol === 'tecnico' && user.estado === false) {
            return res.status(403).send({ message: `Su registro se encuentra sujeto a aprobación
                por parte del Líder TIC. Una vez sea aprobado, podrá ingresar al sistema. ¡Gracias!` });
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
            token: await tokenSign(user),
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



module.exports = {registerCtrl, loginCtrl , verifyToken}

/* undefined a la propiedad password del objeto user: es útil para evitar 
que la contraseña sea incluida en las respuestas HTTP o se registre 
en los logs.  { strict: false } permite esta modificación, incluso si el 
esquema de Mongoose tiene restricciones estrictas. */


/* El error de clave duplicada en MongoDB genera un código 
de error 11000. */
