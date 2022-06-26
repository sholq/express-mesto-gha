const cardsRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const {celebrate, Joi} = require("celebrate");

cardsRouter.get('/', getCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/http(s?)\:\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+(\/[0-9a-zA-Z\-._~:\/?#\]@!$&'()*\+,;=]+#?)?/),
  })
}), createCard);

cardsRouter.delete('/:cardId', deleteCard);

cardsRouter.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().alphanum().length(24),
  })
}), putLike);

cardsRouter.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().alphanum().length(24),
  })
}), deleteLike);

module.exports = { cardsRouter };
