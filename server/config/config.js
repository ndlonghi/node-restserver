// Port
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Db
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
  // urlDB = 'mongodb+srv://cafe-user:bovewhat@cluster0-ptgzk.mongodb.net/cafe'; // TODO
} else {
  urlDB = 'mongodb+srv://cafe-user:bovewhat@cluster0-ptgzk.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
