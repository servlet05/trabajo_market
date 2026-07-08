// Ejemplo de uso en app.js
const ip = await getClientIP();
const jobId = 1;

// Solicitar código
const result = await securityManager.requestContactCode(ip, jobId, '5512345678');
if (result.success) {
    // Mostrar input para código
    showCodeInput(jobId);
} else {
    alert(result.error);
}

// Verificar código
const verifyResult = securityManager.verifyCode(ip, jobId, '123456');
if (verifyResult.verified) {
    // Mostrar teléfono
    showPhoneNumber(verifyResult.phoneNumber);
} else {
    alert(verifyResult.error);
}