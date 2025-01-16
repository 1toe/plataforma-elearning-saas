function validateRUT(rut) {
    const regex = /^[0-9]{7,8}-[0-9Kk]$/;
    return regex.test(rut);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/;
    return regex.test(email);
}

function validatePassword(password) {
    return password.length >= 1; // La contraseña debe tener al menos 1 carácter
}

// Validación del login
function validateLogin(email, password) {
    if (!validateEmail(email)) {
        return { isValid: false, error: "El correo electrónico no es válido." };
    }
    if (!validatePassword(password)) {
        return { isValid: false, error: "La contraseña debe tener al menos 1 caracteres." };
    }
    return { isValid: true, error: "" };
}

module.exports = {
    validateRUT,
    validateEmail,
    validatePassword,
    validateLogin, 
};
