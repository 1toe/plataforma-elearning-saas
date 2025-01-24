const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const render = require('../utils/render');
const Content = require("../models/Content");

const lessonController = {
    create: async (req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const formData = new URLSearchParams(body);
                const course_id = parseInt(formData.get('course_id'));
                
                if (!course_id) {
                    console.error('Error: course_id es undefined o inválido');
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('ID del curso inválido');
                    return;
                }

                // Validar que el curso existe
                const course = await Course.findById(course_id);
                if (!course) {
                    console.error(`Error: No se encontró el curso con ID ${course_id}`);
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Curso no encontrado');
                    return;
                }

                const lessonData = {
                    course_id: course_id,
                    titulo: formData.get('titulo'),
                    descripcion: formData.get('descripcion'),
                    orden: parseInt(formData.get('orden')) || 1
                };

                console.log('Creando lección con datos:', lessonData);
                await Lesson.create(lessonData);
                res.writeHead(302, { Location: `/curso/${course_id}/lecciones` });
                res.end();
            } catch (error) {
                console.error('Error al crear lección:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            }
        });
    },
    getCrearLeccion: (req, res, { isAuthenticated, userRole }) => {
        const html = render('crear-leccion.html', { title: 'Crear Lección' }, isAuthenticated, userRole);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    },
    showLessons: async (req, res, { isAuthenticated, userRole, courseId }) => {
        try {
            
            // Convertir courseId a número y validar
            const numericCourseId = parseInt(courseId);
            if (!numericCourseId) {
                console.error('Error: ID del curso inválido:', courseId);
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end(render("404.html", { title: "Curso no encontrado" }));
                return;
            }

            const course = await Course.findById(numericCourseId);
            if (!course) {
                console.error('Error: Curso no encontrado con ID:', numericCourseId);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(render("404.html", { title: "Curso no encontrado" }));
                return;
            }

            const lessons = await Lesson.findByCourseId(numericCourseId);
            console.log('Lecciones encontradas:', lessons);
            console.log('Rol del usuario:', userRole);
            console.log('¿Es profesor?:', userRole === 'docente');
            
            const data = {
                curso_id: numericCourseId,
                curso_nombre: course.nombre,
                lecciones: JSON.stringify(lessons || []),
                isTeacher: userRole === 'docente' ? 'true' : 'false'
            };
            
            console.log('Datos enviados a la vista:', data);
            
            const html = render('lecciones.html', data, isAuthenticated, userRole);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } catch (error) {
            console.error('Error al mostrar lecciones:', error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end('Error interno del servidor');
        }
    },
    editLesson: async (req, res, { isAuthenticated, userRole, lessonId }) => {
        try {
            // Verificar autenticación y rol
            if (!isAuthenticated || userRole !== "docente") {
                res.writeHead(403, { "Content-Type": "text/html" });
                res.end(render("403.html", { title: "Acceso Denegado" }));
                return;
            }

            // Obtener la lección y sus contenidos
            const lesson = await Lesson.findById(lessonId);
            if (!lesson) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(render("404.html", { title: "Lección no encontrada" }));
                return;
            }

            // Obtener el curso al que pertenece la lección
            const course = await Course.findById(lesson.course_id);
            if (!course) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(render("404.html", { title: "Curso no encontrado" }));
                return;
            }

            // Obtener los contenidos de la lección
            const contenidos = await Content.findByLessonId(lessonId);

            // Calcular el siguiente orden para nuevos contenidos
            const nextOrden = contenidos.length > 0 
                ? Math.max(...contenidos.map(c => c.orden)) + 1 
                : 1;

            // Renderizar la vista de edición
            const html = render("editar-leccion.html", {
                title: "Editar Lección",
                curso: course,
                leccion: lesson,
                contenidos: contenidos,
                nextOrden: nextOrden
            });
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } catch (error) {
            console.error("Error al editar lección:", error);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end(render("500.html", { title: "Error del Servidor" }));
        }
    },
    updateLesson: async (req, res, { lessonId }) => {
        try {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async () => {
                const formData = new URLSearchParams(body);
                const lessonData = {
                    titulo: formData.get("titulo"),
                    descripcion: formData.get("descripcion"),
                    orden: parseInt(formData.get("orden")),
                    estado: formData.get("estado")
                };

                // Actualizar la lección
                await Lesson.update(lessonId, lessonData);

                // Obtener la lección actualizada para redirigir
                const lesson = await Lesson.findById(lessonId);
                
                // Redirigir a la lista de lecciones del curso
                res.writeHead(302, { 
                    "Location": `/curso/${lesson.course_id}/lecciones`
                });
                res.end();
            });
        } catch (error) {
            console.error("Error al actualizar lección:", error);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end(render("500.html", { title: "Error del Servidor" }));
        }
    },
    deleteLesson: async (req, res, { lessonId }) => {
        try {
            // Obtener la lección antes de eliminarla para saber a qué curso redirigir
            const lesson = await Lesson.findById(lessonId);
            if (!lesson) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Lección no encontrada" }));
                return;
            }

            const courseId = lesson.course_id;

            // Eliminar la lección y sus contenidos asociados
            await Content.deleteByLessonId(lessonId);
            await Lesson.delete(lessonId);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ 
                success: true, 
                redirectUrl: `/curso/${courseId}/lecciones` 
            }));
        } catch (error) {
            console.error("Error al eliminar lección:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error al eliminar la lección" }));
        }
    }
};

module.exports = lessonController; 