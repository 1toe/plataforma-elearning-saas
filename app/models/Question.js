const db = require('../data/db');

class Question {
    static async findByCourseId(courseId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM questions WHERE course_id = ? ORDER BY id ASC',
                [courseId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows || []);
                }
            );
        });
    }

    static async create(questionData) {
        return new Promise((resolve, reject) => {
            const { course_id, question_text, question_type, points } = questionData;
            db.run(
                'INSERT INTO questions (course_id, question_text, question_type, points) VALUES (?, ?, ?, ?)',
                [course_id, question_text, question_type, points || 1],
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

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM questions WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    static async findById(id) {
        const query = `
            SELECT * FROM questions
            WHERE id = ?
        `;
        return await db.get(query, [id]);
    }
}

module.exports = Question; 