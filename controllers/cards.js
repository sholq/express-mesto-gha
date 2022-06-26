const { Card } = require('../models/cards');

const NotFoundError = require('../errors/not-found-error');
const AccessError = require('../errors/access-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .populate('owner')
    .then((card) => {
      if (card.owner._id === req.user._id) {
        return Card.findByIdAndRemove(req.params.cardId);
      }
      throw new AccessError('Ошибка доступа');
    })
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Карточка не найдена'))
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Карточка не найдена'))
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
