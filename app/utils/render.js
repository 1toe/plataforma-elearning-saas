const fs = require("fs");
const path = require("path");

function render(viewName, placeholders = {}) {
    const layoutPath = path.join(__dirname, "../views", "mainlayout.html");
    const viewPath = path.join(__dirname, "../views", viewName);

    // Leer el contenido de los archivos
    let layoutContent = fs.readFileSync(layoutPath, "utf8");
    let viewContent = fs.readFileSync(viewPath, "utf8");

    // Insertar contenido dinámico dentro de la plantilla principal
    layoutContent = layoutContent.replace("{{content}}", viewContent); 

    // Reemplazar marcadores de posición
    for (const [key, value] of Object.entries(placeholders)) {
        layoutContent = layoutContent.replace(new RegExp(`{{${key}}}`, "g"), value || "");
    }

    return layoutContent;
} 

module.exports = render;
