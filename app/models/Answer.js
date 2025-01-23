const db = require('../data/db');

class Answer {
    static async create({ question_id, answer_text, is_correct }) {
        const query = `
            INSERT INTO answers (question_id, answer_text, is_correct)
            VALUES (?, ?, ?)
        `;
        const result = await db.run(query, [question_id, answer_text, is_correct]);
        return result.lastID;
    }

    static async findByQuestionId(questionId) {
        const query = `
            SELECT * FROM answers
            WHERE question_id = ?
            ORDER BY id ASC
        `;
        return await db.all(query, [questionId]);
    }
}

module.exports = Answer; 