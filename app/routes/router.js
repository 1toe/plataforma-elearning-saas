const AuthController = require("../controllers/AuthController");
const render = require("../utils/render");
const cookie = require("cookie");
const Usuario = require("../models/User");
const CourseController = require("../controllers/CourseController");
const LessonController = require("../controllers/LessonController");
const ContentController = require("../controllers/ContentController");

const rutas = async (req, res) => {
    // Parse URL to get the path
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const isAuthenticated = cookies.loggedIn === "true";
        const email = cookies.email || "";
        let userRole = "";

        if (isAuthenticated && email) {
            try {
                const usuario = await Usuario.findByEmail(email);
                userRole = usuario ? usuario.tipo_usuario : "";
            } catch (error) {
                console.error("Error al obtener el rol del usuario:", error.message);
            }
        }

        console.log("¿Está logeado (isAuthenticated)?:", isAuthenticated, "Rol:", userRole);

        // Add courses route
        if (path === "/cursos") {
            return await CourseController.showCourses(req, res, { isAuthenticated, userRole });
        }

        if (req.url === "/" && req.method === "GET") {
            const html = render("index.html", { title: "Inicio" }, isAuthenticated, userRole);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
            return;
        }

        if (req.url === "/auth/login" && req.method === "GET") {
            if (isAuthenticated) {
                res.writeHead(302, { Location: "/" });
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
                res.writeHead(302, { Location: "/" });
                res.end();
                return;
            }
            return AuthController.getRegister(req, res);
        }

        if (req.url === "/auth/registro" && req.method === "POST") {
            return AuthController.postRegister(req, res);
        }

        if (req.url === "/logout" && req.method === "GET") {
            res.writeHead(302, {
                Location: "/auth/login",
                "Set-Cookie": "loggedIn=false; Path=/; HttpOnly",
            });
            res.end();
            return;
        }
        /** 
                if (req.url === "/cursos" && req.method === "GET") {
                    if (!isAuthenticated) {
                        res.writeHead(302, { Location: "/auth/login" });
                        res.end();
                        return;
                    }
                    const html = render("cursos.html", { title: "Cursos" }, isAuthenticated, userRole);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(html);
                    return;
                }
        */
        if (req.url === "/perfil" && req.method === "GET") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            return AuthController.getProfile(req, res);
        }

        if (req.url === "/crear-cursos" && req.method === "GET") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            return AuthController.getCrearCursos(req, res);
        }

        if (req.method === 'POST' && req.url === '/courses/create') {
            return CourseController.create(req, res);
        }

        if (path === "/crear-leccion" && req.method === "GET") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            return LessonController.getCrearLeccion(req, res, { isAuthenticated, userRole });
        }

        if (path === "/crear-contenido" && req.method === "GET") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            return ContentController.getCrearContenido(req, res, { isAuthenticated, userRole });
        }

        if (req.method === 'POST' && path === '/lessons/create') {
            return LessonController.create(req, res);
        }

        if (req.method === 'POST' && path === '/contents/create') {
            return ContentController.create(req, res);
        }

        // Ruta para mostrar el test de un curso
        if (path.match(/^\/curso\/\d+\/test$/)) {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            
            // Extraer el ID del curso de la URL y agregarlo a req.params
            const courseId = path.split('/')[2];
            req.params = { ...req.params, id: courseId };
            
            console.log('Parámetros enviados al controlador:', {
                isAuthenticated,
                userRole,
                userId,
                params: req.params
            });

            await CourseController.showTest(req, res, { 
                isAuthenticated, 
                userRole, 
                userId 
            });
            return;
        }

        if (path.match(/^\/curso\/\d+\/pregunta$/) && req.method === "POST") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            const courseId = path.split('/')[2];
            return CourseController.addQuestion(req, res, courseId);
        }

        if (path.match(/^\/curso\/\d+\/respuestas$/) && req.method === "POST") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            const courseId = path.split('/')[2];
            return CourseController.submitAnswers(req, res, courseId);
        }

        if (path.match(/^\/curso\/\d+\/lecciones$/) && req.method === "GET") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            const courseId = path.split('/')[2];
            return LessonController.showLessons(req, res, { isAuthenticated, userRole, courseId });
        }

        if (path.match(/^\/curso\/\d+\/contenido$/) && req.method === "GET") {
            if (!isAuthenticated) {
                res.writeHead(302, { Location: "/auth/login" });
                res.end();
                return;
            }
            const courseId = path.split('/')[2];
            return ContentController.showContent(req, res, { isAuthenticated, userRole, courseId });
        }

        if (path.match(/^\/curso\/\d+\/editar$/) && req.method === "GET") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            const courseId = path.split('/')[2];
            return CourseController.editCourse(req, res, { isAuthenticated, userRole, courseId });
        }

        if (path.match(/^\/curso\/\d+\/test\/nuevo$/) && req.method === "GET") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            const courseId = path.split('/')[2];
            return CourseController.newTest(req, res, { isAuthenticated, userRole, courseId });
        }

        // Ruta para ver el contenido de un curso
        if (path.match(/^\/curso\/\d+\/contenido$/)) {
            const courseId = path.split('/')[2];
            const CourseContentController = require('../controllers/CourseContentController');
            await CourseContentController.showCourseContent(req, res, { isAuthenticated, userRole, userId, courseId });
            return;
        }

        // Ruta para ver el contenido de una lección
        if (path.match(/^\/leccion\/(\d+)\/contenido$/)) {
            const lessonId = path.match(/^\/leccion\/(\d+)\/contenido$/)[1];
            const ContentController = require('../controllers/ContentController');
            await ContentController.showContent(req, res, { isAuthenticated, userRole, userId, lessonId });
            return;
        }

        // Ruta para marcar una lección como completada
        if (path.match(/^\/leccion\/\d+\/completar$/) && req.method === 'POST') {
            const lessonId = path.split('/')[2];
            const ContentController = require('../controllers/ContentController');
            await ContentController.markAsCompleted(req, res, { userId, lessonId });
            return;
        }

        // Ruta para editar una lección
        if (path.match(/^\/leccion\/\d+\/editar$/) && req.method === "GET") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            const lessonId = path.split('/')[2];
            const LessonController = require('../controllers/LessonController');
            await LessonController.editLesson(req, res, { isAuthenticated, userRole, lessonId });
            return;
        }

        // Ruta para actualizar una lección
        if (path.match(/^\/leccion\/\d+\/actualizar$/) && req.method === "POST") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            const lessonId = path.split('/')[2];
            const LessonController = require('../controllers/LessonController');
            await LessonController.updateLesson(req, res, { lessonId });
            return;
        }

        // Ruta para eliminar una lección
        if (path.match(/^\/leccion\/\d+$/) && req.method === "DELETE") {
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }
            const lessonId = path.split('/')[2];
            const LessonController = require('../controllers/LessonController');
            await LessonController.deleteLesson(req, res, { lessonId });
            return;
        }

        // Ruta para crear una nueva pregunta
        if (path.match(/^\/curso\/\d+\/pregunta$/) && req.method === 'POST') {
            if (!isAuthenticated || userRole !== 'docente') {
                res.writeHead(403, { 'Content-Type': 'text/html' });
                res.end(render('403.html', { title: 'Acceso Denegado' }));
                return;
            }
            const courseId = path.split('/')[2];
            await CourseController.addQuestion(req, res, courseId);
            return;
        }

        // Ruta para enviar respuestas del test
        if (path.match(/^\/curso\/\d+\/respuestas$/) && req.method === 'POST') {
            if (!isAuthenticated || userRole !== 'estudiante') {
                res.writeHead(403, { 'Content-Type': 'text/html' });
                res.end(render('403.html', { title: 'Acceso Denegado' }));
                return;
            }
            const courseId = path.split('/')[2];
            await CourseController.submitAnswers(req, res, courseId);
            return;
        }

        // Ruta para ver resultados del test
        if (path.match(/^\/curso\/\d+\/resultados$/)) {
            if (!isAuthenticated) {
                res.writeHead(403, { 'Content-Type': 'text/html' });
                res.end(render('403.html', { title: 'Acceso Denegado' }));
                return;
            }
            const courseId = path.split('/')[2];
            await CourseController.showResults(req, res, { isAuthenticated, userRole, userId, courseId });
            return;
        }

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
