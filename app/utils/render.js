const fs = require("fs");
const path = require("path");

function getNavbar(isAuthenticated) {
    const guestNavbar = `
        <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="/auth/login">Ingresar</a></li>
        <li class="nav-item"><a class="nav-link" href="/auth/registro">Registrar</a></li>`;
    const userNavbar = `
        <li class="nav-item"><a class="nav-link" href="/">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="/cursos">Cursos</a></li>
        <li class="nav-item"><a class="nav-link" href="/logout">Salir</a></li>`;
    
    return isAuthenticated ? userNavbar : guestNavbar;
}

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
