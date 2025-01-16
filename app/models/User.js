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
