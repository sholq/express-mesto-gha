const {User} = require("../models/users");

const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const {DATA_ERROR_CODE, COMMON_ERROR_CODE} = require("./error_codes");

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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {expiresIn: '7d'}
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};