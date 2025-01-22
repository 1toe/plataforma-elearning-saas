const db = require('../data/db');

class Progress {
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
