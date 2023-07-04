const router = require('express')
  .Router();

const moviesRouter = require('./movies');
const usersRouter = require('./users');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use((request, response, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
