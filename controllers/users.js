require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const { NODE_ENV } = process.env;
const JWT = process.env.REACT_APP_JWT;

module.exports.getUser = (request, response, next) => {
  userSchema.findById(request.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User cannot be found');
      }
      response.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequestError('Incorrect data'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User cannot be found'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (request, response, next) => {
  const {
    name,
    email,
  } = request.body;

  userSchema
    .findByIdAndUpdate(
      request.user._id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User cannot be found');
      }
      response.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(BadRequestError('Incorrect data'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (request, response, next) => {
  const {
    name,
    email,
    password,
  } = request.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema
        .create({
          name,
          email,
          password: hash,
        })
        .then(() => response.status(201)
          .send(
            {
              data: {
                name,
                email,
              },
            },
          ))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('The username with this email has already been registered'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Incorrect input'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (request, response, next) => {
  const {
    email,
    password,
  } = request.body;

  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT : 'cat', {
        expiresIn: '1w',
      });
      response.send({ token });
    })
    .catch(next);
};
