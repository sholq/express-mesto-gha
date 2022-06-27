const { DATA_ERROR_CODE, SIGN_UP_ERROR, COMMON_ERROR_CODE } = require('../errors/error_codes');

module.exports.handleErrors = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(DATA_ERROR_CODE)
      .send({
        message: 'Некорректные данные',
      });

    next();
  }

  if (err.code === 11000) {
    res
      .status(SIGN_UP_ERROR)
      .send({
        message: 'Пользователь уже зарегистрирован',
      });

    next();
  }

  const { statusCode = COMMON_ERROR_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === COMMON_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};
