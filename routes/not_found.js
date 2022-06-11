const notFoundRouter = require('express').Router();
const { CAST_ERROR_CODE } = require('../controllers/error_codes');

notFoundRouter.all('/*', (req, res) => {
  res.status(CAST_ERROR_CODE).send({ message: 'Некорректные данные' });
});

module.exports = { notFoundRouter };
