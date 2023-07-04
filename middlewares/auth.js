require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV } = process.env;
const JWT = process.env.REACT_APP_JWT;

module.exports = (request, response, next) => {
  const { authorization } = request.headers;
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('You need to log in');
  }

  const token = authorization.replace('Bearer ', '');

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT : 'cat');
  } catch (err) {
    return next(new UnauthorizedError('You need to log in'));
  }

  request.user = payload;
  return next();
};
