/**
 * Este archivo configura y establece la conexión con una base de datos SQLite.
 * Además, inicializa las tablas necesarias para la plataforma de cursos.
 * 
 * Tablas creadas:
 * - users: Almacena información de los usuarios.
 * - courses: Almacena información de los cursos.
 * - lessons: Almacena información de las lecciones de cada curso.
 * - contents: Almacena el contenido de cada lección.
 * - enrollments: Almacena la inscripción de los usuarios en los cursos.
 * - progress: Almacena el progreso de los usuarios en las lecciones.
 * 
 * @module db // Exporta la conexión con la base de datos SQLite.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"), (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conexión con la base de datos SQLite establecida.");
    }
});

// Inicializar las tablas de la base de datos !!!
const initDB = () => {
    db.serialize(() => {

        // Crear tabla 'users'
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                rut TEXT UNIQUE NOT NULL,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                correo TEXT UNIQUE NOT NULL,
                contrasenia TEXT NOT NULL,
                tipo_usuario TEXT CHECK(tipo_usuario IN ('estudiante', 'docente')) NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);


        // Crear tabla 'courses'
        db.run(`
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE NOT NULL,
                nombre TEXT NOT NULL,
                descripcion TEXT,
                fecha_inicio DATE,
                fecha_fin DATE,
                estado TEXT CHECK(estado IN ('activo', 'inactivo', 'borrador')) DEFAULT 'borrador',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla 'lessons'
        db.run(`
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER NOT NULL,
                titulo TEXT NOT NULL,
                descripcion TEXT,
                orden INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            )
        `);

        // Crear tabla 'contents'
        db.run(`
                CREATE TABLE IF NOT EXISTS contents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    lesson_id INTEGER NOT NULL,
                    titulo TEXT NOT NULL,
                    contenido TEXT NOT NULL,
                    url_recurso TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
                )
            `);

        // crear tabla 'enrollments':
        db.run(`
                CREATE TABLE IF NOT EXISTS enrollments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    course_id INTEGER NOT NULL,
                    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
                    estado TEXT CHECK(estado IN ('activo', 'completado', 'abandonado')) DEFAULT 'activo',
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                    UNIQUE(user_id, course_id)
                )
            `);

        // Crear tabla 'progress'
        db.run(`
                CREATE TABLE IF NOT EXISTS progress (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    lesson_id INTEGER NOT NULL,
                    completed BOOLEAN DEFAULT FALSE,
                    last_accessed DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
                    UNIQUE(user_id, lesson_id)
                )
            `);

        console.log("Tablas inicializadas.");
    });
};

initDB();

module.exports = db;
