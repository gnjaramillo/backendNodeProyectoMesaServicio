const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // definir JWT_SECRET en archivo .env

const tokenSign = async (usuario) => {
  const sign = await jwt.sign(
    // payload
    {
      _id: usuario._id,
      rol: usuario.rol,
    },
    JWT_SECRET, 
    { expiresIn: "2h" } // tiempo de expiración del token
  );
  return sign;
};

const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { tokenSign, verifyToken };
