const db = require('../data/db');

class Lesson {
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM lessons WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    static async findByCourseId(courseId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM lessons WHERE course_id = ? ORDER BY orden ASC', [courseId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    static async create(lessonData) {
        return new Promise((resolve, reject) => {
            const { course_id, titulo, descripcion, orden } = lessonData;
            db.run(
                'INSERT INTO lessons (course_id, titulo, descripcion, orden) VALUES (?, ?, ?, ?)',
                [course_id, titulo, descripcion, orden],
                function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                }
            );
        });
    }

    static async update(id, lessonData) {
        return new Promise((resolve, reject) => {
            const { titulo, descripcion, orden, estado } = lessonData;
            db.run(
                'UPDATE lessons SET titulo = ?, descripcion = ?, orden = ?, estado = ? WHERE id = ?',
                [titulo, descripcion, orden, estado, id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM lessons WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = Lesson;
