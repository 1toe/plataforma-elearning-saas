const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const render = require('../utils/render');

const courseContentController = {
    showCourseContent: async (req, res, { isAuthenticated, userRole, userId, courseId }) => {
        try {
            // Obtener información del curso
            const curso = await Course.findById(courseId);
            if (!curso) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Curso no encontrado');
                return;
            }

            // Obtener lecciones del curso
            const lecciones = await Lesson.findByCourseId(courseId);
            
            // Obtener progreso del usuario
            const progreso = await Progress.findByUserAndCourse(userId, courseId);

            // Renderizar la vista
            const html = render('curso-contenido.html', {
                curso: curso,
                lecciones: JSON.stringify(lecciones),
                progreso: JSON.stringify(progreso || []),
                isTeacher: userRole === 'docente'
            }, isAuthenticated, userRole);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al mostrar contenido del curso:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
    }
};

module.exports = courseContentController; 