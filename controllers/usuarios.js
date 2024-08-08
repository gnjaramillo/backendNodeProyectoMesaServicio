const { usuarioModel, storageModel } = require("../models/index.js");
const { handleHttpError } = require ("../utils/handleError.js");
const PUBLIC_URL = process.env.PUBLIC_URL;
const { encrypt, compare } = require("../utils/handlePassword.js");
const { tokenSign } = require("../utils/handleJwt.js");





const getUsuarios = async (req, res) => {
    try {
        const data = await usuarioModel.find({}).populate('foto'); 
        res.send({ data });
    } catch (error) {
        handleHttpError(res, "error al obtener datos", 500);
    }
};


const getUsuariosId = async (req, res) => {
    try {
        const { id } = req.params;  
        const data = await usuarioModel.findById(id).populate('foto'); 
        if (!data) {
            res.send({ message: "Usuario no existe", data });
        }
        res.send({ message: "Usuario consultado exitosamente", data });
    } catch (error) {
        handleHttpError(res, "Error al consultar el usuario");
    }
};


const postUsuarios = async (req, res) => {
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
                url: `${PUBLIC_URL}/usuario-undefined.png`, // url definida en controlador storage
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

        // Crear los datos del usuario incluyendo la referencia al archivo
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

        res.send({ data });
    } catch (error) {
        console.error(error); // Log del error para depuración
        handleHttpError(res, "Error al registrar el usuario");
    }
};


const updateUsuarios = async (req, res) => {
    const userId = req.params.id;
    const { body } = req;
    const file = req.file;

    try {
        let updatedData = { ...body };

        // Si se sube un archivo, agregar la URL de la foto a los datos actualizados
        if (file) {
            // Guardar el archivo en la colección storage
            const fileData = {
                url: `${PUBLIC_URL}/${file.filename}`,
                filename: file.filename
            };
            const fileRecord = await storageModel.create(fileData);

            // Actualizar el campo 'foto' con el ID del archivo guardado
            updatedData.foto = fileRecord._id;
        }

        const data = await usuarioModel.findOneAndUpdate({ _id: userId }, updatedData, { new: true });
        if (!data) {
            res.send({ message: "Usuario no existe", data });
        }
        res.send({ message: `Usuario ${userId} actualizado exitosamente`, data });
    } catch (error) {
        handleHttpError(res, "Error al actualizar el usuario", 500);
    }
};


const deleteUsuarios = async (req, res) => {
    const userId = req.params.id;

    try {
        await usuarioModel.findOneAndDelete({ _id: userId });
        res.send({ message: `Usuario ${userId} eliminado` });
    } catch (error) {
        handleHttpError(res, "Error al consultar el usuario", 500);

    }
};


module.exports = { getUsuarios, postUsuarios, updateUsuarios, deleteUsuarios, getUsuariosId };









 /*
populate es una función de Mongoose que se utiliza para reemplazar las referencias en un documento con los documentos a los que hacen referencia
 find() método de Mongoose que busca todos los documentos en la colección, La consulta {} indica que no hay filtros, por lo que se devuelven todos los documentos.
*/
//req.params es parte de Express.js y se utiliza para acceder a los parámetros de ruta en una solicitud HTTP.