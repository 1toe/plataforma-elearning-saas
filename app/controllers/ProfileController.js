const Usuario = require('../models/User');

const updateProfile = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const data = new URLSearchParams(body);
        const email = data.get('email');
        const password = data.get('password');
        
        try {
            await Usuario.updateProfile(req.user.id, email, password);
            res.writeHead(302, { Location: '/perfil' });
            res.end();
        } catch (error) {
            console.error('Error updating profile:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error updating profile');
        }
    });
};

module.exports = { updateProfile };