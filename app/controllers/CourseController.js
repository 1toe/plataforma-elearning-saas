const courseService = require('../services/courseService');
const render = require('../utils/render');
const Course = require('../models/Course');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const StudentAnswer = require('../models/StudentAnswer');

const courseController = {
    create: async (req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const courseData = new URLSearchParams(body);
                
                // Obtener el último código de curso
                const lastCourse = await Course.findLastCode();
                let nextCode = 1;
                
                if (lastCourse && lastCourse.codigo) {
                    // Si existe un último curso, incrementar el código
                    nextCode = parseInt(lastCourse.codigo) + 1;
                }
                
                // Formatear el código para que siempre tenga 6 dígitos
                const codigo = nextCode.toString().padStart(6, '0');
                
                const course = {
                    codigo: codigo,
                    nombre: courseData.get('nombre'),
                    descripcion: courseData.get('descripcion'),
                    fecha_inicio: courseData.get('fecha_inicio'),
                    fecha_fin: courseData.get('fecha_fin'),
                    estado: courseData.get('estado')
                };

                await courseService.addCourse(course);
                res.writeHead(302, { Location: '/cursos' });
                res.end();

            } catch (error) {
                console.error('Error al crear curso:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            }
        });
    },

    showCourses: async (req, res, { isAuthenticated, userRole }) => {
        try {
            const cursos = await courseService.getAllCourses();
            
            // Format dates for display
            const cursosFormatted = cursos.map(curso => ({
                ...curso,
                fecha_inicio: new Date(curso.fecha_inicio).toLocaleDateString('es-ES'),
                fecha_fin: new Date(curso.fecha_fin).toLocaleDateString('es-ES'),
                created_at: new Date(curso.created_at).toLocaleDateString('es-ES')
            }));

            const html = render('cursos.html', {
                cursos: JSON.stringify(cursosFormatted),
                userRole: userRole
            }, isAuthenticated, userRole);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end('Error al cargar cursos');
        }
    },

    showTest: async (req, res, { isAuthenticated, userRole, courseId }) => {
        try {
            // Obtener el curso
            const course = await Course.findById(courseId);
            if (!course) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Curso no encontrado');
                return;
            }

            // Obtener preguntas del curso
            const questions = await Question.findByCourseId(courseId) || [];
            console.log('Preguntas encontradas:', questions);

            // Para cada pregunta, obtener sus respuestas
            const questionsWithAnswers = await Promise.all(questions.map(async (question) => {
                const answers = await Answer.findByQuestionId(question.id) || [];
                return { ...question, answers };
            }));

            // Renderizar la vista
            const html = render('test-curso.html', {
                title: `Test - ${course.nombre}`,
                curso: course,
                questions: JSON.stringify(questionsWithAnswers),
                isTeacher: userRole === 'docente'
            }, isAuthenticated, userRole);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error('Error al mostrar test:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        }
    },

    addQuestion: async (req, res, courseId) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const formData = new URLSearchParams(body);
                const questionData = {
                    course_id: courseId,
                    question_text: formData.get('question_text'),
                    points: formData.get('points'),
                    answers: formData.getAll('answers[]'),
                    correct_answer: formData.get('correct_answer')
                };

                await Question.create(questionData);
                res.writeHead(302, { Location: `/cursos/${courseId}/test` });
                res.end();
            } catch (error) {
                console.error('Error al crear pregunta:', error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error interno del servidor");
            }
        });
    },

    submitAnswers: async (req, res, courseId) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const formData = new URLSearchParams(body);
                const answers = {};
                
                for (const [key, value] of formData.entries()) {
                    if (key.startsWith('question_')) {
                        const questionId = key.split('_')[1];
                        answers[questionId] = value;
                    }
                }

                await StudentAnswer.submitAnswers(req.user.id, answers);
                res.writeHead(302, { Location: `/curso/${courseId}/resultados` });
                res.end();
            } catch (error) {
                console.error('Error al enviar respuestas:', error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error interno del servidor");
            }
        });
    },

    editCourse: async (req, res) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const courseData = new URLSearchParams(body);
                const courseId = req.params.id;

                // Check if courseId is defined
                if (!courseId) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Course ID is required');
                    return;
                }

                // Obtener el curso actual para mantener el código original
                const currentCourse = await Course.findById(courseId);
                if (!currentCourse) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Curso no encontrado');
                    return;
                }

                const updatedCourse = {
                    codigo: currentCourse.codigo, // Mantener el código original
                    nombre: courseData.get('nombre'),
                    descripcion: courseData.get('descripcion'),
                    fecha_inicio: courseData.get('fecha_inicio'),
                    fecha_fin: courseData.get('fecha_fin'),
                    estado: courseData.get('estado')
                };

                await courseService.updateCourse(courseId, updatedCourse);
                res.writeHead(302, { Location: `/curso/${courseId}` });
                res.end();

            } catch (error) {
                console.error('Error al editar curso:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            }
        });
    }
};

module.exports = courseController;