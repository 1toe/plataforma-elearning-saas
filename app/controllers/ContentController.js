const Content = require('../models/Content');
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

                await Content.create(contentData);
                res.writeHead(302, { Location: `/lecciones/${contentData.lesson_id}` });
                res.end();
            } catch (error) {
                console.error('Error al crear contenido:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            }
        });
    },
    getCrearContenido: (req, res, { isAuthenticated, userRole }) => {
        const html = render('crear-contenido.html', { title: 'Crear Contenido' }, isAuthenticated, userRole);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
};

module.exports = contentController; 