const http = require("http");
const fs = require("fs");
const path = require("path");
const rutas = require("./routes/router");

// Función para servir archivos estáticos
const servirArchivoEstatico = (filePath, res) => {
    const extname = path.extname(filePath);
    const contentType = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
    }[extname] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 - Archivo no encontrado</h1>");
            } else {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error interno del servidor");
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
};

// Crear el servidor HTTP
const servidor = http.createServer((req, res) => {
    // Servir archivos estáticos desde "public"
    const publicPath = path.join(__dirname, "public");
    const filePath = path.join(publicPath, req.url === "/" ? "index.html" : req.url);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        servirArchivoEstatico(filePath, res);
    } else {
        rutas(req, res); // Delegar a las rutas si no es un archivo estático
    }
});

// Configuración del puerto
const PUERTO = 3000;

// Iniciar el servidor
servidor.listen(PUERTO, () => {
    console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});
