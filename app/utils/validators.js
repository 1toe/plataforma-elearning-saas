function validateRUT(rut) {
    const regex = /^[0-9]{7,8}-[0-9Kk]$/;
    return regex.test(rut);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

module.exports = {
    validateRUT,
    validateEmail,
    validatePassword,
};

/* Testeo de almacenaje en BD

function validateRUT(rut) {
    return true; // Bypass, siempre retorna true
}

function validateEmail(email) {
    return true; // Bypass, siempre retorna true
}

function validatePassword(password) {
    return true; // Bypass, siempre retorna true
}

module.exports = {
    validateRUT,
    validateEmail,
    validatePassword,
};


*/