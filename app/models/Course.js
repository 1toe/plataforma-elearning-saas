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

const createCourse = (codigo, nombre, descripcion, fecha_inicio, fecha_fin, estado, callback) => {
    const sql = `INSERT INTO courses (codigo, nombre, descripcion, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [codigo, nombre, descripcion, fecha_inicio, fecha_fin, estado], function(err) {
        callback(err, this.lastID);
    });
};

class Course {
    static find() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM courses';
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

module.exports = {
    createCourse,
    async findAll() {
        // Implementa la lógica para obtener todos los cursos de la fuente de datos
        // return arrayDeCursos;
    }
};
