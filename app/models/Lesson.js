const db = require('../data/db');

class Lesson {
    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM lessons WHERE user_id = ?';
            db.all(query, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static findByCourseId(courseId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM lessons 
                WHERE course_id = ? 
                ORDER BY orden ASC
            `;
            
            db.all(query, [courseId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static create(lessonData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO lessons 
                (course_id, titulo, descripcion, orden)
                VALUES (?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    lessonData.course_id,
                    lessonData.titulo,
                    lessonData.descripcion,
                    lessonData.orden
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }
}

module.exports = Lesson;
