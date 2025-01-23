const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

class Course {
    static create(courseData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO courses 
                (codigo, nombre, descripcion, fecha_inicio, fecha_fin, estado)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    courseData.codigo,
                    courseData.nombre,
                    courseData.descripcion,
                    courseData.fecha_inicio,
                    courseData.fecha_fin,
                    courseData.estado
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    id,
                    codigo,
                    nombre,
                    descripcion,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    created_at
                FROM courses
                ORDER BY created_at DESC
            `;
            
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM courses WHERE id = ?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = Course;