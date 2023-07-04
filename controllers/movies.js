const movieSchema = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getMovies = (request, response, next) => {
  const owner = request.user._id;
  movieSchema
    .find({ owner })
    .then((movies) => response.status(200)
      .send(movies))
    .catch(next);
};

module.exports.createMovie = (request, response, next) => {
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = request.body;
  const owner = request.user._id;

  movieSchema
    .create({
      movieId,
      country,
      director,
      duration,
      year,
      description,
      owner,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
    })
    .then((movie) => response.status(201)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data for card creation'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (request, response, next) => {
  const { movieId } = request.params;

  movieSchema.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('User cannot be found');
      }
      if (request.user._id === movie.owner.toString()) {
        return movie.remove();
      }
      return next(new ForbiddenError('Attempting to delete another users movie'));
    })
    .then((movie) => response.send(movie))
    .catch(next);
};
