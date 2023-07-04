const { NODE_ENV, JWT_SECRET, DB_URL } = process.env;
const devSecret = 'cat';
const devDb = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  NODE_ENV,
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : devSecret,
  DB_URL: NODE_ENV === 'production' ? DB_URL : devDb,
};
