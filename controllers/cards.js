const { Card } = require('../models/cards');

const { COMMON_ERROR_CODE, NOT_FOUND_ERROR_CODE, DATA_ERROR_CODE } = require('./error_codes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch(({ name: err }) => {
      if (err === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch(({ name }) => {
      if (name === 'CastError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch(({ name }) => {
      if (name === 'CastError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
    })
    .catch(({ name }) => {
      if (name === 'CastError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
