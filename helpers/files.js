const multer = require('multer'); // Para el manejo de archivos
const path = require('path');

// Configura el middleware de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombra la imagen con una marca de tiempo
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
}