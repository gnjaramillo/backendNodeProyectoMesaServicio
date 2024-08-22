const crypto = require('crypto');
const { usuarioModel } = require('../models'); 
const { sendMail } = require('../utils/handleEmail');
const bcrypt = require('bcryptjs');





// Generar un token aleatorio
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Solicitar restablecimiento de contraseña
const forgotPassword = async (req, res) => {
    try {
        const { correo } = req.body;
        if (!correo) {
            return res.status(400).send({ message: 'Correo electrónico es requerido' });
        }

        const user = await usuarioModel.findOne({ correo });
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const token = generateToken();
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        const resetUrl = `http://localhost:3010/api/restablecerPassword/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.correo,
            subject: 'Recuperación de Contraseña',
            text: (`Hola ${user.nombre},\n\nPara restablecer tu contraseña, por favor visita el siguiente enlace: \n\n${resetUrl}`
        )};

        await sendMail(mailOptions);
        res.send({ message: 'Correo electrónico enviado' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al enviar el correo electrónico' });
    }
};

// Restablecer la contraseña
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Usuario.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado.' });
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.' });
    }
}; 


module.exports = { forgotPassword,  resetPassword};
