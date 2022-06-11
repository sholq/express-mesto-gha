const { User } = require('../models/users');

const { COMMON_ERROR_CODE, CAST_ERROR_CODE, DATA_ERROR_CODE } = require('./error_codes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return Promise.reject(new Error('CastError'));
    })
    .catch(({ name = false, message = false, path = false }) => {
      if (name || message === 'CastError') {
        if (path) {
          res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
        } else {
          res.status(CAST_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        }
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(({ name: err }) => {
      if (err === 'ValidationError') {
        res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  try {
    const { name = false, about = false } = req.body;

    if (name && about) {
      User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
        .then((user) => res.send(user))
        .catch(({ name: err, path }) => {
          if (err === 'CastError') {
            if (path === '_id') {
              res.status(CAST_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
            } else {
              res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
            }
          } else {
            res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
          }
        });
    } else {
      throw new Error('Некорректные данные');
    }
  } catch ({ message }) {
    res.status(400).send({ message });
  }
};

module.exports.updateAvatar = (req, res) => {
  try {
    const { avatar = false } = req.body;

    if (avatar) {
      User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'CastError') {
            if (err.path === '_id') {
              res.status(CAST_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
            } else {
              res.status(DATA_ERROR_CODE).send({ message: 'Некорректные данные' });
            }
          } else {
            res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
          }
        });
    } else {
      throw new Error('Некорректные данные');
    }
  } catch ({ message }) {
    res.status(400).send({ message });
  }
};
