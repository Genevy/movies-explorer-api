require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const handlerCORS = require('./middlewares/handlerCORS');
const {
  createUserValidation,
  loginValidation,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');
const centralErrorHandler = require('./middlewares/centralErrorHandler');
const { DB_URL } = require('./utils/config');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(handlerCORS);
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
