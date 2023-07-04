const movieRoutes = require('express')
  .Router();

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const {
  createMovieValidation,
  movieByIdValidation,
} = require('../middlewares/validation');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', createMovieValidation, createMovie);
movieRoutes.delete('/:movieId', movieByIdValidation, deleteMovie);

module.exports = movieRoutes;
