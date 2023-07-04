const {
  Joi,
  celebrate,
} = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequestError = require('../errors/BadRequestError');

const urlValidation = (url) => {
  if (isUrl(url)) return url;
  throw new BadRequestError('Incorrect URL');
};

const IdValidation = (id) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  if (regex.test(id)) return id;
  throw new BadRequestError('Incorrect id');
};

module.exports.createMovieValidation = celebrate({
  body: Joi.object()
    .keys({
      movieId: Joi.number()
        .integer()
        .required(),
      country: Joi.string()
        .required(),
      director: Joi.string()
        .required(),
      duration: Joi.number()
        .required(),
      year: Joi.string()
        .required(),
      description: Joi.string()
        .required(),
      image: Joi.string()
        .required()
        .custom(urlValidation),
      trailerLink: Joi.string()
        .required()
        .custom(urlValidation),
      thumbnail: Joi.string()
        .required()
        .custom(urlValidation),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
});

module.exports.movieByIdValidation = celebrate({
  params: Joi.object()
    .keys({
      movieId: Joi.string()
        .required()
        .custom(IdValidation),
    }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30)
        .required(),
      email: Joi.string()
        .required()
        .email(),
    }),
});

module.exports.createUserValidation = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30)
        .required(),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required(),
    }),
});
