const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");

const rutas = (req, res) => {
    try {
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

        // Ruta de logout
        if (req.url === "/logout" && req.method === "GET") {
            res.writeHead(302, {
                Location: "/auth/login",
                "Set-Cookie": "loggedIn=false; HttpOnly", // Eliminar sesión
            });
            res.end();
            return;
        }

        // Ruta raíz (inicio)
        if (req.url === "/" && req.method === "GET") {
            const isAuthenticated = req.headers.cookie && req.headers.cookie.includes("loggedIn=true");
            console.log("isAuthenticated:", isAuthenticated); // Registro de depuración
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(render("index.html", { title: "Inicio" }, isAuthenticated));
            return;
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
