const db = require('../data/db');

class Content {
    static async create(contentData) {
        return new Promise((resolve, reject) => {
            const { lesson_id, titulo, contenido, orden } = contentData;
            db.run(
                'INSERT INTO content (lesson_id, titulo, contenido, orden) VALUES (?, ?, ?, ?)',
                [lesson_id, titulo, contenido, orden],
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

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM content WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    static async findByLessonId(lessonId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT id, titulo, contenido, orden FROM content WHERE lesson_id = ? ORDER BY orden ASC',
                [lessonId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    }

    static async update(id, contentData) {
        return new Promise((resolve, reject) => {
            const { titulo, contenido, orden } = contentData;
            db.run(
                'UPDATE content SET titulo = ?, contenido = ?, orden = ? WHERE id = ?',
                [titulo, contenido, orden, id],
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
            db.run('DELETE FROM content WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    static async deleteByLessonId(lessonId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM content WHERE lesson_id = ?', [lessonId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = Content; 