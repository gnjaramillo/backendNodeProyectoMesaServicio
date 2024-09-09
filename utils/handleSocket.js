// handleSocket.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Aquí se crea la app de Express
const app = express();

// Crea el servidor HTTP a partir de la app de Express
const server = http.createServer(app);

// Inicializa socket.io en el servidor
const io = socketIo(server);

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Escuchar un evento personalizado desde el cliente
    socket.on('eventoPersonalizado', (data) => {
        console.log('Datos recibidos del cliente:', data);
        
        // Enviar respuesta al cliente
        io.emit('respuestaServidor', { message: 'Respuesta del servidor', data });
    });

    // Detectar desconexión
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

// Exporta tanto el servidor como la app
module.exports = { app, server };
