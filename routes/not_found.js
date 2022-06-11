const notFoundRouter = require('express').Router();
const { DATA_ERROR_CODE } = require('../controllers/error_codes');

notFoundRouter.all('/*', (req, res) => {
  res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
});

module.exports = { notFoundRouter };
