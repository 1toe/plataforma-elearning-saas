const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");
const cookie = require("cookie"); // Importar el módulo de cookies
const path = require("path"); // Importar el módulo path

const rutas = (req, res) => {
    try {
        // Parsear las cookies para verificar autenticación
        const cookies = cookie.parse(req.headers.cookie || "");
        const isAuthenticated = cookies.loggedIn === "true"; // Determinar autenticación
        console.log("¿Está logeado (isAuthenticated)?:", isAuthenticated); // Depuración

        // Rutas públicas
        if (req.url === "/" && req.method === "GET") {
            const html = render("index.html", { title: "Inicio" }, isAuthenticated);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
            return;
        }

        // Rutas de autenticación protegidas para usuarios autenticados
        if (req.url === "/auth/login" && req.method === "GET") {
            if (isAuthenticated) {
                res.writeHead(302, { Location: "/" }); // REDIRIGIR si ya está autenticado
                res.end();
                return;
            }
            return AuthController.getLogin(req, res);
        }

        if (req.url === "/auth/login" && req.method === "POST") {
            return AuthController.postLogin(req, res);
        }

        if (req.url === "/auth/registro" && req.method === "GET") {
            if (isAuthenticated) {
                res.writeHead(302, { Location: "/" }); // REDIRIGIR si ya está autenticado
                res.end();
                return;
            }
            return AuthController.getRegister(req, res);
        }

        if (req.url === "/auth/registro" && req.method === "POST") {
            return AuthController.postRegister(req, res);
        }

        // Ruta de logout
        if (req.url === "/logout" && req.method === "GET") {
            res.writeHead(302, {
                Location: "/auth/login",
                "Set-Cookie": "loggedIn=false; Path=/; HttpOnly", // Elimina autenticación
            });
            res.end();
            return;
        }

        // Ruta protegida (Eg: Cursos)
        if (req.url === "/cursos" && req.method === "GET") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            const html = render("cursos.html", { title: "Cursos" }, isAuthenticated);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
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
