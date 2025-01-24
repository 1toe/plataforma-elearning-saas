const Content = require('../models/Content');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const render = require('../utils/render');

const contentController = {
    create: async (req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const formData = new URLSearchParams(body);
                const contentData = {
                    lesson_id: formData.get('lesson_id'),
                    titulo: formData.get('titulo'),
                    contenido: formData.get('contenido')
                };

                // Validate contentData before creating
                if (!contentData.lesson_id || !contentData.titulo || !contentData.contenido) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Faltan datos requeridos');
                    return;
                }

                await Content.create(contentData);
                res.writeHead(302, { Location: `/leccion/${contentData.lesson_id}/contenido` });
                res.end();
            } catch (error) {
                console.error('Error al crear contenido:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            }
        });
    },

    showContent: async (req, res, { isAuthenticated, userRole, userId, lessonId }) => {
        try {
            if (!lessonId) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('ID de lección no proporcionado');
                return;
            }

            // Obtener la lección
            const lesson = await Lesson.findById(lessonId);
            if (!lesson) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Lección no encontrada');
                return;
            }

            // Obtener el curso
            const course = await Course.findById(lesson.course_id);
            if (!course) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Curso no encontrado');
                return;
            }

            // Obtener el contenido de la lección
            const contenidos = await Content.findByLessonId(lessonId);

            // Obtener lecciones anterior y siguiente
            const allLessons = await Lesson.findByCourseId(lesson.course_id);
            const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
            const leccionAnterior = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
            const leccionSiguiente = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

            // Obtener o crear progreso
            let progress = null;
            if (userId && userRole !== 'docente') {
                progress = await Progress.findByUserAndLesson(userId, lessonId);
                if (!progress) {
                    await Progress.create(userId, lessonId);
                    progress = { completed: false };
                }
                // Actualizar último acceso
                await Progress.updateLastAccessed(userId, lessonId);
            }

            // Renderizar la vista con el contenido
            const html = render('contenido.html', {
                title: lesson.titulo,
                leccion: JSON.stringify(lesson),
                curso: course,
                contenidos: JSON.stringify(contenidos || []),
                leccionAnterior: JSON.stringify(leccionAnterior),
                leccionSiguiente: JSON.stringify(leccionSiguiente),
                isCompleted: progress ? progress.completed : false,
                isTeacher: userRole === 'docente'
            }, isAuthenticated, userRole);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al mostrar contenido:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
    },

    markAsCompleted: async (req, res, { userId }) => {
        try {
            const lessonId = path.split('/')[2];
            if (!lessonId || !userId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Parámetros faltantes' }));
            }
            await Progress.markAsCompleted(userId, lessonId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (error) {
            console.error('Error al marcar como completado:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
    },

    getCrearContenido: (req, res, { isAuthenticated, userRole }) => {
        const html = render('crear-contenido.html', { title: 'Crear Contenido' }, isAuthenticated, userRole);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
};

module.exports = contentController;
