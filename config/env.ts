export const ENV = {
  BASE_URL: process.env.BASE_URL || '',
  USER_NAME: process.env.USER_NAME || '',
  PASSWORD: process.env.PASSWORD || '',
};

// Validación rápida de seguridad
if (!ENV.BASE_URL || !ENV.USER_NAME || !ENV.PASSWORD) {
  throw new Error('❌ ERROR: Faltan variables de entorno en el archivo .env');
}