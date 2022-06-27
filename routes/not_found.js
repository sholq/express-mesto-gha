const notFoundRouter = require('express').Router();

const NotFoundError = require('../errors/not-found-error');

notFoundRouter.all('/*', (req, res, next) => next(new NotFoundError('Некорректные данные')));

module.exports = { notFoundRouter };
