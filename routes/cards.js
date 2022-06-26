const { celebrate, Joi } = require('celebrate');

const cardsRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const { urlRegEx } = require('../regex/regex');

cardsRouter.get('/', getCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegEx),
  }),
}), createCard);

cardsRouter.delete('/:cardId', deleteCard);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), putLike);

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), deleteLike);

module.exports = { cardsRouter };
