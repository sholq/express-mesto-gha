const {Card} = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then(cards => {
      res.send(cards);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = async (req, res) => {
  const {name, link} = req.body;

  try {
    const card = await Card.create({name, link, owner: req.user._id});

    Card.findById(card._id)
      .populate('owner')
      .then(card => {
        res.send(card);
      })
      .catch(err => {
        (err.name === 'CastError') ?
          res.status(500).send({ message: 'Пользователь не был создан' }) :
          res.status(500).send({ message: 'Произошла ошибка' });
      });
  } catch(err) {
    (err.name === 'ValidationError') ?
      res.status(400).send({ message: 'Некорректные данные' }) :
      res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then(card => {
      res.send(card);
    })
    .catch(err => {
      (err.name === 'CastError') ?
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }) :
        res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then(card => {
      res.send(card);
    })
    .catch(err => {
      (err.name === 'CastError') ? (
        (err.path === '_id') ?
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }) :
          res.status(400).send({ message: 'Некорректные данные' })
      ) : res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate( req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then(card => {
      res.send(card);
    })
    .catch(err => {
      (err.name === 'CastError') ? (
        (err.path === '_id') ?
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }) :
          res.status(400).send({ message: 'Некорректные данные' })
      ) : res.status(500).send({ message: 'Произошла ошибка' });
    });
};