const { addCourse } = require('../services/courseService');
const Course = require('../models/Course');
const render = require('../utils/render');

const create = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const courseData = new URLSearchParams(body);
        const course = {
            codigo: courseData.get('codigo'),
            nombre: courseData.get('nombre'),
            descripcion: courseData.get('descripcion'),
            fecha_inicio: courseData.get('fecha_inicio'),
            fecha_fin: courseData.get('fecha_fin'),
            estado: courseData.get('estado')
        };
        addCourse(course, (err, courseId) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error al crear el curso');
            }
            res.writeHead(302, { Location: '/cursos' });
            res.end();
        });
    });
};

const showCourses = async (req, res, { isAuthenticated, userRole }) => {
    try {
        const courses = await Course.findAll();
        const html = render('cursos.html', { courses, title: 'Lista de Cursos' }, isAuthenticated, userRole);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.writeHead(500, { "Content-Type": "tex1t/plain" });
        res.end('Error interno del servidor');
    }
};

module.exports = {
    create,
    showCourses
};