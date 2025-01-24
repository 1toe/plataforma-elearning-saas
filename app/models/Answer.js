const db = require('../data/db');

class Answer {
    static async findByQuestionId(questionId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM answers WHERE question_id = ? ORDER BY id ASC',
                [questionId],
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

    static async create(answerData) {
        return new Promise((resolve, reject) => {
            const { question_id, answer_text, is_correct } = answerData;
            db.run(
                'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)',
                [question_id, answer_text, is_correct],
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
            db.run('DELETE FROM answers WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    static async deleteByQuestionId(questionId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM answers WHERE question_id = ?', [questionId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}

module.exports = Answer; 