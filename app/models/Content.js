const db = require('../data/db');

class Content {
    static create(contentData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO contents 
                (lesson_id, titulo, contenido)
                VALUES (?, ?, ?)
            `;

            db.run(
                sql,
                [
                    contentData.lesson_id,
                    contentData.titulo,
                    contentData.contenido
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static findByLessonId(lessonId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, titulo, contenido, created_at
                FROM contents
                WHERE lesson_id = ?
                ORDER BY created_at ASC
            `;
            
            db.all(sql, [lessonId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = Content; 