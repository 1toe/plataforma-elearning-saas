const Lesson = require('../models/Lesson');
const render = require('../utils/render');

const lessonController = {
    create: async (req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const formData = new URLSearchParams(body);
                const lessonData = {
                    course_id: formData.get('course_id'),
                    titulo: formData.get('titulo'),
                    descripcion: formData.get('descripcion'),
                    orden: formData.get('orden')
                };

                await Lesson.create(lessonData);
                res.writeHead(302, { Location: `/cursos/${lessonData.course_id}` });
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
            const lessons = await Lesson.findByCourseId(courseId);
            const html = render('lecciones.html', {
                lecciones: lessons,
                curso: { id: courseId },
                isTeacher: userRole === 'docente'
            }, isAuthenticated, userRole);

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