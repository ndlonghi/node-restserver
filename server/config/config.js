// Port
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Config token
process.env.CADUCIDAD_TOKEN = '48h';

process.env.SEED = process.env.SEED || 'secret';

// Db
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "473270679410-o74lmoifmgahe10c3o9kj2mtm9nnik1a.apps.googleusercontent.com";
