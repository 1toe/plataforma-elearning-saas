const { createCourse } = require('../models/Course');

const addCourse = (courseData, callback) => {
    const { codigo, nombre, descripcion, fecha_inicio, fecha_fin, estado } = courseData;
    createCourse(codigo, nombre, descripcion, fecha_inicio, fecha_fin, estado, callback);
};

module.exports = { addCourse };
