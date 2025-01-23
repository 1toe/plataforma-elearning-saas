const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const render = require('../utils/render');

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
    }
};

module.exports = lessonController; 