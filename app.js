const express = require('express');
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

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(express.json());
app.use(requestLogger);
app.use(handlerCORS);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, login);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((error, request, response, next) => {
  const {
    status = 500,
    message,
  } = error;
  response.status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
