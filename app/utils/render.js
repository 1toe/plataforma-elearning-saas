const fs = require("fs");
const path = require("path");

function getNavbar(isAuthenticated) {
    const guestNavbar = `
        <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="/auth/login">Ingresar</a></li>
        <li class="nav-item"><a class="nav-link" href="/auth/registro">Crear cuenta</a></li>`;
    const userNavbar = `
        <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="/cursos">Cursos</a></li>
        <li class="nav-item"><a class="nav-link" href="/perfil">Perfil</a></li>
        <li class="nav-item"><a class="nav-link" href="/logout">Salir</a></li>`;

    return isAuthenticated ? userNavbar : guestNavbar;
}

/**
 * Renderiza una vista HTML combinando un layout principal con una vista específica y reemplazando marcadores de posición.
 *
 * @param {string} viewName - El nombre del archivo de vista a renderizar (debe estar en la carpeta "../views").
 * @param {Object} [placeholders={}] - Un objeto con los marcadores de posición y sus valores correspondientes para reemplazar en el contenido.
 * @param {boolean} [isAuthenticated=false] - Indica si el usuario está autenticado para determinar el contenido de la barra de navegación.
 * @returns {string} - El contenido HTML final con el layout y la vista combinados y los marcadores de posición reemplazados.
 *
 * @requires path - Módulo de Node.js para trabajar con rutas de archivos y directorios.
 * @requires fs - Módulo de Node.js para trabajar con el sistema de archivos.
 * @requires getNavbar - Función que devuelve el contenido HTML de la barra de navegación según el estado de autenticación.
 *
 * @file
 */
function render(viewName, placeholders = {}, isAuthenticated = false) {
    const layoutPath = path.join(__dirname, "../views", "mainlayout.html");
    const viewPath = path.join(__dirname, "../views", viewName);

    let layoutContent = fs.readFileSync(layoutPath, "utf8");
    let viewContent = fs.readFileSync(viewPath, "utf8");

    // Reemplazar el contenido dinámico del layout
    layoutContent = layoutContent.replace("{{dynamic_nav}}", getNavbar(isAuthenticated));
    layoutContent = layoutContent.replace("{{content}}", viewContent);

    // Reemplazar otros marcadores de posición
    for (const [key, value] of Object.entries(placeholders)) {
        layoutContent = layoutContent.replace(new RegExp(`{{${key}}}`, "g"), value || "");
    }

    return layoutContent;
}

module.exports = render;