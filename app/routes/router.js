const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");


const rutas = (req, res) => {
    try {
        // Ruta de inicio
        if (req.url === "/" && req.method === "GET") {
            const html = render("index.html", { title: "Inicio" });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
            return;
        }

        // Rutas de autenticación
        if (req.url === "/auth/login" && req.method === "GET") {
            return AuthController.getLogin(req, res);
        }
        if (req.url === "/auth/login" && req.method === "POST") {
            return AuthController.postLogin(req, res);
        }
        if (req.url === "/auth/registro" && req.method === "GET") {
            return AuthController.getRegister(req, res);
        }
        if (req.url === "/auth/registro" && req.method === "POST") {
            return AuthController.postRegister(req, res);
        }

        // Ruta del perfil
        if (req.url === "/perfil" && req.method === "GET") {
            return AuthController.getProfile(req, res);
        }

        // Ruta no encontrada
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(render("404.html", { title: "Página no encontrada" }));
    } catch (error) {
        console.error("Error en el router:", error.message);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error interno del servidor");
        }
    }
};

module.exports = rutas;
