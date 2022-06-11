const notFoundRouter = require('express').Router();
const { NOT_FOUND_ERROR_CODE } = require('../controllers/error_codes');

notFoundRouter.all('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Некорректные данные' });
});

module.exports = { notFoundRouter };
