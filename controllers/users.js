const {User} = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      res.send(users);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send(user))
    .catch(err => {
      (err.name === 'CastError') ?
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }) :
        res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send(user))
    .catch(err => {
      (err.name === 'ValidationError') ?
        res.status(400).send({message: 'Некорректные данные'}) :
        res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;

  User.findByIdAndUpdate(req.user._id, {name, about}, { new: true, runValidators: true})
    .then(user => res.send(user))
    .catch(err => {
      (err.name === 'CastError') ?
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }) :
        res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findByIdAndUpdate(req.user._id, {avatar}, { new: true, runValidators: true})
    .then(user => res.send(user))
    .catch(err => {
      (err.name === 'CastError') ?
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }) :
        res.status(500).send({ message: 'Произошла ошибка' });
    });
}