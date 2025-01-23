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
                const course = {
                    codigo: courseData.get('codigo'),
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
            const course = await Course.findById(courseId);
            const questions = await Question.findByCourseId(courseId);
            
            for (let question of questions) {
                question.answers = await Answer.findByQuestionId(question.id);
            }

            const html = render("test-curso.html", {
                curso: course,
                questions: questions,
                isTeacher: userRole === 'docente',
                isStudent: userRole === 'estudiante'
            }, isAuthenticated, userRole);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } catch (error) {
            console.error('Error al mostrar test:', error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error interno del servidor");
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
                res.writeHead(302, { Location: `/curso/${courseId}/test` });
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
    }
};

module.exports = courseController;