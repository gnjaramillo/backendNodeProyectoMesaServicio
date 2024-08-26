// Importamos y configuramos el paquete dotenv para cargar las variables de entorno desde un archivo .env
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require('./config/mongo')
const cookieParser = require('cookie-parser')
// const multer = require('multer');
const morgan = require("morgan");


// Creamos una instancia de la aplicación Express
const app = express();
// tu servidor Express permite solicitudes desde cualquier origen
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  
}));
app.use(morgan("dev"))
// tengo que establecer a mi app que este preparado para recibir un post
app.use(express.json())
// Middleware para analizar cuerpos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));
// Configuración de multer

app.use(cookieParser())

// los recursos publicos salen de la carpeta storage
app.use(express.static("storage"))
// Vamos a invocar las rutas 
app.use("/api", require("./routes"))




const port = process.env.PORT || 8000;

// Ruta de prueba para verificar la conexión
app.get('/api/test', (req, res) => {
    res.json({ message: 'Conexión exitosa con el backend' });
  });


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

dbConnect()
//



/* // Middleware para manejar FormData
 // Esto es para manejar FormData sin archivos */