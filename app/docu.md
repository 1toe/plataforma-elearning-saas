# Elearn

## Descripción

Elearn es una plataforma de aprendizaje en línea diseñada para facilitar la creación, gestión y consumo de contenido educativo. El proyecto está construido con tecnologías modernas pero sin depender de frameworks pesados, lo que lo hace ligero y fácil de mantener. La plataforma permite a los usuarios (tanto estudiantes como docentes) interactuar con cursos, lecciones y evaluaciones de manera eficiente.

## Estructura del Proyecto

El proyecto sigue una estructura modular que facilita su mantenimiento y expansión. La organización de los archivos y directorios está pensada para separar claramente las responsabilidades de cada componente:

- **controllers/**: Contiene los controladores que manejan la lógica de negocio y la interacción entre las vistas y los modelos.
- **data/**: Aloja los scripts y configuraciones relacionadas con la base de datos, incluyendo la inicialización y la población de datos de ejemplo.
- **models/**: Define los modelos de datos que representan las entidades del sistema y su interacción con la base de datos.
- **public/**: Contiene los archivos estáticos como CSS, JavaScript e imágenes que son servidos directamente al cliente.
- **utils/**: Incluye utilidades y funciones auxiliares que son utilizadas en diferentes partes del sistema.
- **views/**: Almacena las plantillas HTML que se renderizan para mostrar la interfaz de usuario.
- **server.js**: Es el punto de entrada del servidor, donde se configura y se inicia la aplicación.

## Tecnologías Principales

El proyecto utiliza una combinación de tecnologías modernas y robustas:

- **Backend**: Node.js (Vanilla) para manejar las solicitudes HTTP y la lógica del servidor.
- **Base de Datos**: SQLite, una base de datos ligera y fácil de usar que se integra perfectamente con Node.js.
- **Frontend**: HTML5, CSS3 y JavaScript (Vanilla) para construir una interfaz de usuario interactiva y responsiva.

## Base de Datos

La base de datos SQLite es el corazón del sistema, almacenando toda la información necesaria para el funcionamiento de la plataforma. Las tablas principales incluyen:

1. **users**: Almacena la información de los usuarios, incluyendo su rol (estudiante o docente).
2. **courses**: Contiene los cursos disponibles, con detalles como nombre, descripción y fechas.
3. **lessons**: Almacena las lecciones de cada curso, con su título, descripción y orden.
4. **content**: Contiene el contenido detallado de cada lección, incluyendo texto en formato Markdown.
5. **enrollments**: Registra las inscripciones de los usuarios a los cursos.
6. **progress**: Almacena el progreso de los usuarios en las lecciones, marcando cuáles han sido completadas.
7. **questions**: Contiene las preguntas de los tests asociados a los cursos.
8. **answers**: Almacena las respuestas posibles para cada pregunta.
9. **student_answers**: Registra las respuestas de los estudiantes a las preguntas de los tests.

## Funcionalidades Principales

1. **Gestión de Cursos**:Los docentes pueden crear, editar y eliminar cursos. Cada curso tiene un código único, nombre, descripción, fechas de inicio y fin, y un estado (activo, inactivo o borrador). Los estudiantes pueden ver los cursos disponibles e inscribirse en ellos.
2. **Gestión de Lecciones**:Dentro de cada curso, los docentes pueden crear lecciones con un título, descripción y orden. Las lecciones se organizan secuencialmente, y los estudiantes pueden avanzar a través de ellas marcando su progreso.
3. **Gestión de Contenido**:Cada lección puede contener múltiples piezas de contenido. Los docentes pueden crear y editar este contenido, y los estudiantes pueden verlo en una interfaz amigable con vista previa en tiempo real.
4. **Progreso del Usuario**:Los estudiantes pueden marcar las lecciones como completadas, y el sistema registra su progreso. Se muestra una barra de progreso visual que indica cuántas lecciones han sido completadas y cuántas faltan.
5. **Evaluaciones**:
   Los estudiantes pueden realizar un test final. El sistema registra sus respuestas y proporciona retroalimentación. Los docentes pueden crear y editar las preguntas y respuestas de estos tests.

## Flujo de Trabajo

1. **Autenticación**: Los usuarios pueden registrarse e iniciar sesión. Los estudiantes y docentes tienen diferentes permisos y accesos.
2. **Navegación de Cursos**: Los estudiantes pueden ver los cursos disponibles, inscribirse y acceder a su contenido.
3. **Aprendizaje**: Los estudiantes avanzan a través de las lecciones, marcando su progreso y completando el contenido.
4. **Evaluación**: Independientemente, ya sea al completar todas las lecciones, o no, los estudiantes pueden realizar el test final para evaluar su comprensión.
5. **Gestión (Docentes)**: Los docentes pueden crear y editar cursos, lecciones y contenido, así como gestionar las evaluaciones.

## Estilos y Diseño

El proyecto utiliza Bootstrap y CSS, lo que proporciona una base sólida para el diseño y la maquetación. Además, se han realizado personalizaciones para adaptar la apariencia a las necesidades específicas de la plataforma. Estas personalizaciones incluyen:

- **Colores**: Paleta de colores con tonos de verde y azul para transmitir calma y confianza.
- **Tipografía**: Fuentes sans-serif para una lectura clara.
- **Espaciado y márgenes**: Ajustes para mejorar la legibilidad y experiencia de usuario.
- **Responsividad**: Diseño adaptativo para móviles, tablets y escritorios.

## Ejecución del Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
node server.js

# 3. Acceder a la aplicación
# Abre tu navegador y visita:
http://localhost:3000
```

## Mejoras Futuras

- Autenticación de dos factores.
- Sistema de notificaciones.
- Integración con archivos multimedia.
- Refinamiento de la interfaz de usuario.
- Implementación de API REST.

## Ejemplo de Uso

### Creación de un Nuevo Curso

Formulario intuitivo para docentes con generación automática de código único.

### Realización de Tests

Tests finales con retroalimentación inmediata y análisis de resultados para docentes.

## Conclusión

Elearn es una plataforma robusta y flexible, ideal para instituciones educativas, empresas y educadores independientes. Su enfoque en simplicidad, seguridad y escalabilidad lo posiciona como una herramienta transformadora en el aprendizaje digital.

## Ventajas Clave

1. **Facilidad de Uso**: Interfaz intuitiva.
2. **Flexibilidad**: Adaptación a diferentes estilos de enseñanza.
3. **Escalabilidad**: Arquitectura ligera para crecimiento sostenido.
4. **Personalización**: Expansión modular sin frameworks pesados.
5. **Seguridad**: Protección de datos y roles definidos.

## Casos de Uso

- Instituciones educativas.
- Formación interna en empresas.
- Educadores independientes.
