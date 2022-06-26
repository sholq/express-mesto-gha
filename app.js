const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const {DATA_ERROR_CODE, SIGN_UP_ERROR, COMMON_ERROR_CODE} = require("./errors/error_codes");

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', (err) => console.log('Connection failed with - ', err));

const { usersRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const { notFoundRouter } = require('./routes/not_found');

const { createUser, login } = require('./controllers/auth');
const auth = require('./middlewares/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log({ headers: req.headers, body: req.body });
  console.log('Запрос залогирован!');
  next();
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', notFoundRouter);
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    err.statusCode = DATA_ERROR_CODE;
    err.message = 'Некорректные данные';
  }

  if (err.code === 11000) {
    err.statusCode = SIGN_UP_ERROR;
    err.message = 'Пользователь уже зарегистрирован';
  }

  const { statusCode = COMMON_ERROR_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === COMMON_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
