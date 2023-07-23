const allowedCors = [
  'https://movies.genevy.nomoreparties.sbs',
  'http://movies.genevy.nomoreparties.sbs',
  'https://api.movies.genevy.nomoreparties.sbs',
  'http://api.movies.genevy.nomoreparties.sbs',
  'http://localhost:3001',
  'http://localhost:3000',
  'localhost:3000',
];

const handlerCORS = (request, response, next) => {
  const { origin } = request.headers;
  const { method } = request;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = request.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    response.header('Access-Control-Allow-Origin', origin);
    response.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    response.header('Access-Control-Allow-Headers', requestHeaders);
    return response.end();
  }

  return next();
};

module.exports = handlerCORS;
