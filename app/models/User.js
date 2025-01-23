/**
 * Este módulo define la clase `Usuario` que interactúa con la base de datos para realizar operaciones CRUD relacionadas con los usuarios.
 * 
 * Depende de:
 * - `../data/db`: El módulo de base de datos que proporciona métodos para ejecutar consultas SQL.
 * 
 * Métodos:
 * 
 * - `create({ rut, nombre, apellido, correo, contrasenia, tipo_usuario })`: 
 *   Crea un nuevo usuario en la base de datos.
 *   @param {Object} user - Objeto que contiene los datos del usuario.
 *   @param {string} user.rut - RUT del usuario.
 *   @param {string} user.nombre - Nombre del usuario.
 *   @param {string} user.apellido - Apellido del usuario.
 *   @param {string} user.correo - Correo electrónico del usuario.
 *   @param {string} user.contrasenia - Contraseña del usuario.
 *   @param {string} user.tipo_usuario - Tipo de usuario.
 *   @returns {Promise<Object>} Promesa que resuelve con el ID del nuevo usuario.
 * 
 * - `findByEmail(correo)`:
 *   Busca un usuario en la base de datos por su correo electrónico.
 *   @param {string} correo - Correo electrónico del usuario.
 *   @returns {Promise<Object|null>} Promesa que resuelve con el usuario encontrado o null si no existe.
 * 
 * - `findAll()`:
 *   Busca todos los usuarios en la base de datos.
 *   @returns {Promise<Array>} Promesa que resuelve con una lista de todos los usuarios.
 */
const db = require("../data/db");

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
    static async findByEmail(email) { // Buscar un usuario por su correo electrónico
        // Diferencia entre email y correo = email es un objeto, correo es un string
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE correo = ?"; // Consulta SQL
            db.get(query, [email], (err, row) => {
                if (err) { // Si hay un error en la consulta
                    return reject(err); // Entonmces, devolver el error
                }
                resolve(row); // Devolver el usuario encontrado
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

    // Add this method to the Usuario class
    static getEnrollments(userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT e.*, c.nombre as course_name 
                FROM enrollments e
                JOIN courses c ON e.course_id = c.id
                WHERE e.user_id = ?
                ORDER BY e.fecha_inscripcion DESC
            `;
            
            db.all(query, [userId], (err, rows) => {
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
