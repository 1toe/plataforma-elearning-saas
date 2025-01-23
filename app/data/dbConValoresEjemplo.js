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
                fecha_inicio TEXT,
                fecha_fin TEXT,
                estado TEXT CHECK(estado IN ('activo', 'inactivo', 'borrador')) NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla 'lessons'
        db.run(`
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER,
                titulo TEXT NOT NULL,
                descripcion TEXT,
                orden INTEGER,
                FOREIGN KEY(course_id) REFERENCES courses(id)
            )
        `);

        // Crear tabla 'content'
        db.run(`
            CREATE TABLE IF NOT EXISTS content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER,
                titulo TEXT NOT NULL,
                contenido TEXT,
                orden INTEGER,
                FOREIGN KEY(lesson_id) REFERENCES lessons(id)
            )
        `);

        // Crear tabla 'enrollments'
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

        // Insertar datos de ejemplo
        db.parallelize(() => {
            // Insertar profesores
            db.run(`INSERT OR IGNORE INTO users (rut, nombre, apellido, correo, contrasenia, tipo_usuario) VALUES 
                ('98765432-1', 'Louis', 'Armstrong', 'larmstrong@profe.cl', 'larmstrong@profe.cl', 'docente'),
                ('12349876-5', 'Ella', 'Fitzgerald', 'efitzgerald@profe.cl', 'efitzgerald@profe.cl', 'docente'),
                ('45678901-2', 'Miles', 'Davis', 'mdavis@profe.cl', 'mdavis@profe.cl', 'docente')`);

            // Insertar estudiantes
            db.run(`INSERT OR IGNORE INTO users (rut, nombre, apellido, correo, contrasenia, tipo_usuario) VALUES 
                ('56789012-3', 'Charlie', 'Parker', 'cparker@alumno.cl', 'cparker@alumno.cl', 'estudiante'),
                ('67890123-4', 'Sarah', 'Vaughan', 'svaughan@alumno.cl', 'svaughan@alumno.cl', 'estudiante'),
                ('78901234-5', 'John', 'Coltrane', 'jcoltrane@alumno.cl', 'jcoltrane@alumno.cl', 'estudiante'),
                ('89012345-6', 'Billie', 'Holiday', 'bholiday@alumno.cl', 'bholiday@alumno.cl', 'estudiante')`);

            // Insertar cursos
            db.run(`INSERT OR IGNORE INTO courses (codigo, nombre, descripcion, estado) VALUES 
                ('JAZZ101', 'Historia del Jazz', 'Introducción a la historia y evolución del jazz desde sus orígenes hasta la actualidad', 'activo'),
                ('IMPRO201', 'Técnicas de Improvisación', 'Curso avanzado de improvisación musical en el contexto del jazz', 'activo'),
                ('VOCAL301', 'Técnica Vocal Avanzada', 'Desarrollo de técnicas vocales profesionales para el jazz y géneros relacionados', 'activo'),
                ('COMP101', 'Composición Musical', 'Fundamentos de la composición musical en el jazz', 'activo'),
                ('INST101', 'Instrumentación Jazz', 'Estudio de los diferentes instrumentos y su rol en el jazz', 'borrador')`);

            // Insertar lecciones para Historia del Jazz
            db.run(`INSERT OR IGNORE INTO lessons (course_id, titulo, descripcion, orden) VALUES 
                (1, 'Orígenes del Jazz', 'Nueva Orleans y los primeros años del jazz', 1),
                (1, 'La Era del Swing', 'Big bands y la evolución del género', 2),
                (1, 'Bebop y Cool Jazz', 'La revolución del jazz moderno', 3),
                (1, 'Jazz Contemporáneo', 'Tendencias actuales y fusiones', 4)`);

            // Insertar lecciones para Técnicas de Improvisación
            db.run(`INSERT OR IGNORE INTO lessons (course_id, titulo, descripcion, orden) VALUES 
                (2, 'Fundamentos de Improvisación', 'Conceptos básicos y escalas', 1),
                (2, 'Patrones Melódicos', 'Desarrollo de vocabulario musical', 2),
                (2, 'Improvisación Modal', 'Técnicas avanzadas de improvisación', 3),
                (2, 'Ritmo y Groove', 'Aspectos rítmicos en la improvisación', 4)`);

            // Insertar contenido para las lecciones de Historia del Jazz
            db.run(`INSERT OR IGNORE INTO content (lesson_id, titulo, contenido, orden) VALUES 
                (1, 'Los Orígenes', 'El jazz nació en Nueva Orleans a principios del siglo XX...', 1),
                (1, 'Pioneros', 'Los primeros músicos que definieron el género fueron...', 2),
                (2, 'La Era Dorada', 'Las big bands transformaron el panorama musical...', 1),
                (2, 'Grandes Orquestas', 'Las orquestas más influyentes de la época...', 2),
                (3, 'Revolución Bebop', 'Charlie Parker y Dizzy Gillespie revolucionaron...', 1),
                (3, 'Cool Jazz', 'Miles Davis y el nacimiento del cool jazz...', 2)`);

            // Insertar contenido para las lecciones de Improvisación
            db.run(`INSERT OR IGNORE INTO content (lesson_id, titulo, contenido, orden) VALUES 
                (5, 'Escalas Básicas', 'Las escalas fundamentales para la improvisación...', 1),
                (5, 'Armonía Funcional', 'Entendiendo las progresiones armónicas...', 2),
                (6, 'Desarrollo Motívico', 'Técnicas para desarrollar motivos musicales...', 1),
                (6, 'Frases Melódicas', 'Construcción de frases coherentes...', 2)`);

            // Insertar inscripciones
            db.run(`INSERT OR IGNORE INTO enrollments (user_id, course_id, estado) VALUES 
                (4, 1, 'activo'),
                (4, 2, 'activo'),
                (5, 1, 'activo'),
                (5, 3, 'activo'),
                (6, 2, 'activo'),
                (7, 1, 'activo')`);

            // Insertar progreso
            db.run(`INSERT OR IGNORE INTO progress (user_id, lesson_id, completed, last_accessed) VALUES 
                (4, 1, true, CURRENT_TIMESTAMP),
                (4, 2, true, CURRENT_TIMESTAMP),
                (4, 3, false, CURRENT_TIMESTAMP),
                (5, 1, true, CURRENT_TIMESTAMP),
                (5, 2, false, CURRENT_TIMESTAMP),
                (6, 5, true, CURRENT_TIMESTAMP),
                (6, 6, false, CURRENT_TIMESTAMP)`);
        });

        console.log("Base de datos inicializada con datos de ejemplo.");
    });
};

initDB();

module.exports = db;
