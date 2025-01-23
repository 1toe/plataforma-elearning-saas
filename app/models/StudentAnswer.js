const db = require('../data/db');

class StudentAnswer {
    static async submitAnswers(userId, answers) {
        const query = `
            INSERT INTO student_answers (user_id, question_id, answer_id)
            VALUES (?, ?, ?)
        `;
        
        for (const [questionId, answerId] of Object.entries(answers)) {
            await db.run(query, [userId, questionId, answerId]);
        }
    }

    static async getStudentAnswers(userId, courseId) {
        const query = `
            SELECT sa.*, q.question_text, a.answer_text, a.is_correct
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            JOIN answers a ON sa.answer_id = a.id
            WHERE sa.user_id = ? AND q.course_id = ?
        `;
        return await db.all(query, [userId, courseId]);
    }
}

module.exports = StudentAnswer; 