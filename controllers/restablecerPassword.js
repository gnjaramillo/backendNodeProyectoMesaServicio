const crypto = require('crypto');
const { usuarioModel } = require('../models');
const bcrypt = require('bcryptjs');

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hashear el token recibido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar al usuario con el token y que no haya expirado
    const user = await usuarioModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(password, 12); // Hashear la nueva contraseña
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};


module.exports = { resetPassword};
