

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.sqlite');

const getAllCourses = (callback) => {
    db.all('SELECT * FROM courses', [], (err, rows) => {
        callback(err, rows);
    });
};

const getCourseById = (id, callback) => {
    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
};

module.exports = { getAllCourses, getCourseById };
