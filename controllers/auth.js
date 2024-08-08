const express = require("express");
const router = express.Router();
const { encrypt, compare } = require("../utils/handlePassword");
const { usuarioModel, storageModel } = require("../models"); // Asegúrate de importar todos los modelos necesarios
const { tokenSign } = require("../utils/handleJwt");
const {handleHttpError} = require ("../utils/handleError.js");

const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3010";

// registrar el usuario

const registerCtrl = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const file = req.file;
        const passwordHash = await encrypt(password);
        const body = { ...rest, password: passwordHash };

        let fileRecord;
        let fotoId;

        // Verificar si se subió un archivo
        if (!file) {
            // Si no se sube una foto, utilizar la foto por defecto
            const fileData = {
                url: `${PUBLIC_URL}/usuario-undefined.png`, //url definida en controlador storage
                filename: 'usuario-undefined.png'
            };

            console.log(fileData);

            // Buscar o guardar la foto por defecto en la colección storage
            let fileSaved = await storageModel.findOne({ filename: 'usuario-undefined.png' });
            if (!fileSaved) {
                fileSaved = await storageModel.create(fileData);
            }
            fotoId = fileSaved._id;
        } else {
            const fileData = {
                url: `${PUBLIC_URL}/${file.filename}`,
                filename: file.filename
            };

            console.log(fileData);

            // Guardar el archivo en la colección storage
            const fileSaved = await storageModel.create(fileData);
            fotoId = fileSaved._id;
        }

        // Crear usuario incluyendo foto
        const userData = {
            ...body,
            foto: fotoId
        };

        const dataUser = await usuarioModel.create(userData);
        dataUser.password = undefined; // Ocultar la contraseña en la respuesta

        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        };

        res.send({message:`Usuario registrado exitosamente`, data });
    } catch (error) {
        console.error(error); // Log del error para depuración
        handleHttpError(res, "error al registrar el usuario");
    }
} 






// loguear el usuario
const loginCtrl = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Encontrar el usuario por su correo y seleccionar la contraseña
        const user = await usuarioModel.findOne({ correo }).select('password username correo tipoUsuario');
       
        console.log(user)

        if (!user) {
            return handleHttpError(res, "usuario no existe", 404);
        }

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
        const dataUser = {
            token: await tokenSign(user),
            user
        };

        res.send({  message: "Usuario ha ingresado exitosamente", dataUser});
    } catch (error) {
        handleHttpError(res, "error login usuario");
    }
};



module.exports = {registerCtrl, loginCtrl }



/* undefined a la propiedad password del objeto user. 
Esto efectivamente elimina la propiedad password del objeto en memoria 
(no en la base de datos). Uso común: Esto es útil para evitar 
que la contraseña sea incluida en las respuestas HTTP o se registre 
en los logs.  { strict: false } permite esta modificación incluso si el 
esquema de Mongoose tiene restricciones estrictas.
 */


