const { User } = require('../models/users');

const NotFoundError = require("../errors/not-found-error");
const DataError = require("../errors/data-error");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name = false, about = false } = req.body;

  if (name && about) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => {
        res.send(user);
      })
      .catch(next);
  } else {
    throw new DataError('Некорректные данные');
  }
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar = false } = req.body;

  if (avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        res.send(user);
      })
      .catch(next);
  } else {
    throw new DataError('Некорректные данные');
  }
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}
