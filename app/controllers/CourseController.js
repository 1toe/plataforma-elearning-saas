const courseService = require('../services/courseService');
const render = require('../utils/render');

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
                cursos: JSON.stringify(cursosFormatted)
            }, isAuthenticated, userRole);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end('Error al cargar cursos');
        }
    }
};

module.exports = courseController;