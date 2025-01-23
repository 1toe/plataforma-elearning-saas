const Course = require('../models/Course');

const courseService = {
    addCourse: async (courseData) => {
        try {
            const courseId = await Course.create(courseData);
            return courseId;
        } catch (error) {
            throw error;
        }
    },

    getAllCourses: async () => {
        try {
            const courses = await Course.findAll();
            return courses;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = courseService;