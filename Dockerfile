# Usa una imagen base de Node.js
FROM node:latest


# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de tu aplicación
COPY . .

# Expone el puerto en el que la app escucha
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "run", "dev"]
