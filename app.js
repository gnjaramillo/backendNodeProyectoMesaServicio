/* require("dotenv").config();
const express = require("express");
const path = require('path');
const cors = require("cors");
const dbConnect = require('./config/mongo')
const cookieParser = require('cookie-parser')
const morgan = require("morgan");
const { server } = require('./utils/handleSocket');

const app = express();
// tu servidor Express permite solicitudes desde cualquier origen
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));
app.use(morgan("dev"));
app.use(express.json());

// Middleware para analizar cuerpos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Esto es para el html
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// los recursos publicos salen de la carpeta storage
app.use(express.static("storage"))


// Invocar rutas
app.use("/api", require("./routes"));

const port = process.env.PORT || 8000;



server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

dbConnect();

 */

require("dotenv").config();
const express = require("express");
const { app, server } = require('./utils/handleSocket'); // Importa app y server
const path = require('path');
const cors = require("cors");
const dbConnect = require('./config/mongo')
const cookieParser = require('cookie-parser')
const morgan = require("morgan");


// Configuración de Express en la app


app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.MOVIL_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));



app.use(morgan("dev"));
app.use(express.json());

// Middleware para analizar cuerpos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Esto es para el html
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// los recursos publicos salen de la carpeta storage
app.use(express.static("storage"))


// Invoca las rutas de la API
app.use("/api", require("./routes"));


// Ruta para listar archivos en la carpeta storage
/* app.get('/list-storage', (req, res) => {
  fs.readdir(path.join(__dirname, 'storage'), (err, files) => {
      if (err) {
          return res.status(500).send("Error reading directory");
      }
      res.send(files);  // Devuelve la lista de archivos
  });
}); */

const port = process.env.PORT || 8000;

// Escucha en el puerto usando server.listen
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Conecta a la base de datos
dbConnect();

