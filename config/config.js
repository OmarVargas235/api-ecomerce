// =====================================
// PUERTO
// =====================================
process.env.PORT = process.env.PORT || 5000;

// ====================================
// SEED de autenticacion
// ====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =====================================
// Base de Datos
// =====================================
process.env.DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/ecomerce-API';

// =====================================
// Puerto del Frontend
// =====================================
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// =====================================
// User mailer password
// =====================================
process.env.MAILER = process.env.MAILER;

// =====================================
// Cloudinary nombre
// =====================================
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dpwmtiqbn';

// =====================================
// Cloudinary key
// =====================================
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '857543854452749';

// =====================================
// Cloudinary key ssecret
// =====================================
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '0zv9CbvaEReMOSY1hCbWQu_bkz0';