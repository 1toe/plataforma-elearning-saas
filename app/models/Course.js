const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

class Course {
    static findLastCode() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT codigo 
                FROM courses 
                ORDER BY CAST(codigo AS INTEGER) DESC 
                LIMIT 1
            `;

            db.get(sql, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async validateCodigo(codigo) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM courses WHERE codigo = ?';
            db.get(sql, [codigo], (err, row) => {
                if (err) reject(err);
                else resolve(row.count === 0);
            });
        });
    }

    static create(courseData) {
        return new Promise(async (resolve, reject) => {
            try {
                // Validar que el código sea único
                const isValid = await this.validateCodigo(courseData.codigo);
                if (!isValid) {
                    reject(new Error('El código del curso ya existe'));
                    return;
                }

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
            } catch (error) {
                reject(error);
            }
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
            const query = `SELECT * FROM courses WHERE id = ?`;
            db.get(query, [id], (err, row) => {
                if (err) {
                    console.error('Error al buscar curso por ID:', err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

}

module.exports = Course;