const { Card } = require('../models/cards');

const { COMMON_ERROR_CODE, CAST_ERROR_CODE, DATA_ERROR_CODE } = require('./error_codes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const newCard = await Card.create({ name, link, owner: req.user._id });

    Card.findById(newCard._id)
      .populate('owner')
      .then((card) => {
        res.send(card);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(CAST_ERROR_CODE).send({ message: 'Пользователь не был создан' });
        } else {
          res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
    } else {
      res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        if (err.path === '_id') {
          res.status(CAST_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        } else {
          res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
        }
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        if (err.path === '_id') {
          res.status(CAST_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        } else {
          res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
        }
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
