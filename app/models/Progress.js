const db = require('../data/db');

class Progress {
    static create(userId, lessonId) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO progress (user_id, lesson_id, completed, last_accessed)
                VALUES (?, ?, false, CURRENT_TIMESTAMP)
            `;
            
            db.run(sql, [userId, lessonId], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    static findByUserAndLesson(userId, lessonId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, completed, last_accessed
                FROM progress
                WHERE user_id = ? AND lesson_id = ?
            `;
            
            db.get(sql, [userId, lessonId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static findByUserAndCourse(userId, courseId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT p.*, l.id as lesson_id
                FROM progress p
                JOIN lessons l ON p.lesson_id = l.id
                WHERE p.user_id = ? AND l.course_id = ?
            `;
            
            db.all(sql, [userId, courseId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static markAsCompleted(userId, lessonId) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE progress
                SET completed = true, last_accessed = CURRENT_TIMESTAMP
                WHERE user_id = ? AND lesson_id = ?
            `;
            
            db.run(sql, [userId, lessonId], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    static updateLastAccessed(userId, lessonId) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE progress
                SET last_accessed = CURRENT_TIMESTAMP
                WHERE user_id = ? AND lesson_id = ?
            `;
            
            db.run(sql, [userId, lessonId], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }

    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM progress WHERE user_id = ?';
            db.all(query, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static findByUserIdAndLessonId(userId, lessonId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?';
            db.get(query, [userId, lessonId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = Progress;
