const db = require('../data/db');

class Question {
    static async create({ course_id, question_text, points }) {
        const query = `
            INSERT INTO questions (course_id, question_text, points)
            VALUES (?, ?, ?)
        `;
        const result = await db.run(query, [course_id, question_text, points]);
        return result.lastID;
    }

    static async findByCourseId(courseId) {
        const query = `
            SELECT * FROM questions
            WHERE course_id = ?
            ORDER BY id ASC
        `;
        return await db.all(query, [courseId]);
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