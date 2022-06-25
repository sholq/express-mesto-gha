const { User } = require('../models/users');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { COMMON_ERROR_CODE, NOT_FOUND_ERROR_CODE, DATA_ERROR_CODE } = require('./error_codes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then(hash => User.create({ name, about, avatar, email, password: hash }))
      .then((user) => {
        res.send(user);
      })
      .catch(({ name: err }) => {
        if (err === 'ValidationError') {
          res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
        } else {
          res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    throw new Error("Bad email");
  }
};

module.exports.updateProfile = (req, res) => {
  const { name = false, about = false } = req.body;

  if (name && about) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => {
        res.send(user);
      })
      .catch(({ name: err }) => {
        if (err === 'ValidationError') {
          res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
        } if (err === 'CastError') {
          res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        } else {
          res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar = false } = req.body;

  if (avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        res.send(user);
      })
      .catch(({ name: err }) => {
        if (err === 'ValidationError') {
          res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
        } if (err === 'CastError') {
          res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        } else {
          res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
  }
};
