const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");
const cookie = require("cookie"); // Importar el módulo de cookies
const path = require("path"); // Importar el módulo path

/**
 * Función de enrutamiento principal para manejar las solicitudes HTTP entrantes.
 * 
 * Esta función determina la autenticación del usuario a través de cookies y redirige
 * o responde según la ruta solicitada y el método HTTP. Maneja rutas públicas, rutas
 * protegidas por autenticación y rutas de autenticación (login, registro, logout).
 * 
 * Dependencias:
 * - cookie: Para parsear las cookies de la solicitud.
 * - AuthController: Controlador para manejar las rutas de autenticación (login y registro).
 * - render: Función para renderizar plantillas HTML.
 * 
 * Rutas manejadas:
 * - GET /: Página de inicio pública.
 * - GET /auth/login: Página de login (redirige si ya está autenticado).
 * - POST /auth/login: Procesa el formulario de login.
 * - GET /auth/registro: Página de registro (redirige si ya está autenticado).
 * - POST /auth/registro: Procesa el formulario de registro.
 * - GET /logout: Cierra la sesión del usuario.
 * - GET /cursos: Página de cursos protegida (requiere autenticación).
 * - Cualquier otra ruta: Responde con una página 404.
 * 
 * Manejo de errores:
 * - Captura y maneja cualquier error durante el enrutamiento, respondiendo con un
 *   mensaje de error 500 si ocurre un error interno del servidor.
 * 
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
const rutas = (req, res) => {
    try {
        // Parsear las cookies para verificar autenticación
        const cookies = cookie.parse(req.headers.cookie || "");
        const isAuthenticated = cookies.loggedIn === "true"; // Determinar autenticación
        console.log("¿Está logeado (isAuthenticated)?:", isAuthenticated); // Depuración

        // Nota:
        // Si el método req.method === "GET" significa que el cliente está solicitando una página.
        // Si el método req.method === "POST" significa que el cliente está enviando datos al servidor.

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

        // Rutas protegida: Cursos
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

        // Ruta protegida: Perfil 
        if (req.url === "/perfil" && req.method === "GET") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            // Importar el controlador de perfil
            return AuthController.getProfile(req, res);
        }


        // Rutas protegida: Crear cursos
        if (req.url === "/crear-cursos" && req.method === "GET") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            return AuthController.getCrearCursos(req, res);
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
