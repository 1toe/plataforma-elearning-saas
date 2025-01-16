const db = require("../database/db");

class Usuario {
    // Crear un nuevo usuario
    static create({ rut, nombre, apellido, correo, contrasenia, tipo_usuario }) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO users (rut, nombre, apellido, correo, contrasenia, tipo_usuario)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.run(query, [rut, nombre, apellido, correo, contrasenia, tipo_usuario], function (err) {
                if (err) {
                    reject(err); // Error durante la inserción
                } else {
                    resolve({ id: this.lastID }); // Éxito
                }
            });
        });
    }


    // Buscar un usuario por correo
    static findByEmail(correo) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM users WHERE correo = ?
            `;
            db.get(query, [correo], (err, row) => {
                if (err) {
                    reject(err); // Error en la consulta
                } else {
                    resolve(row); // Usuario encontrado o null
                }
            });
        });
    }

    // Buscar todos los usuarios
    static findAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM users
            `;
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Usuario;
