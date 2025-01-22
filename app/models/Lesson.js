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
            const query = 'SELECT * FROM lessons WHERE course_id = ?';
            db.all(query, [courseId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Lesson;
