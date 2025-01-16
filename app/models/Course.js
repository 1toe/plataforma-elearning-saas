

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

const getAllCourses = (callback) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        callback(err, rows);
    });
};

/**
 * Obtiene un curso por su ID desde la base de datos.
 *
 * @param {number} id - El ID del curso a obtener.
 * @param {function} callback - La función de callback que se ejecutará después de obtener el curso.
 *                              Recibe dos argumentos: un error (si ocurre) y la fila del curso.
 *
 * @description Esta función utiliza una consulta SQL para seleccionar un curso de la tabla 'courses'
 *              basado en el ID proporcionado. Depende de la conexión a la base de datos (db) y de la
 *              existencia de una tabla llamada 'courses' con una columna 'id'.
 */
const getCourseById = (id, callback) => {
    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
};

module.exports = { getAllCourses, getCourseById };
