const { addCourse } = require('../services/courseService');
const Course = require('../models/Course');

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

const showCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('cursos', { courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading courses');
    }
};

module.exports = {
    create,
    showCourses
};