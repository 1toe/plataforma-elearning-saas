const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");
const cookie = require("cookie"); // Importar el módulo de cookies

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
                "Set-Cookie": "loggedIn=false; Path=/; HttpOnly", // Elimina la autenticación
            });
            res.end();
            return;
        }

        // Ruta raíz (inicio)
        if (req.url === "/" && req.method === "GET") {
            const cookies = cookie.parse(req.headers.cookie || ""); // Parsear las cookies
            const isAuthenticated = cookies.loggedIn === "true"; // Verificar si el usuario está autenticado

            console.log("isAuthenticated:", isAuthenticated); // Registro de depuración

            // Renderizar la vista de inicio con el navbar dinámico
            const html = render("index.html", { title: "Inicio", dynamic_nav: getNavbar(isAuthenticated) });
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

// Navbar dinámico según autenticación
function getNavbar(isAuthenticated) {
    if (isAuthenticated) {
        // Navbar para usuarios autenticados
        return `
            <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="/cursos">Cursos</a></li>
            <li class="nav-item"><a class="nav-link" href="/logout">Salir</a></li>
        `;
    } else {
        // Navbar para invitados (no autenticados)
        return `
            <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
            <li class="nav-item"><a class="nav-link" href="/auth/login">Ingresar</a></li>
            <li class="nav-item"><a class="nav-link" href="/auth/registro">Registrar</a></li>
        `;
    }
}

module.exports = rutas;
