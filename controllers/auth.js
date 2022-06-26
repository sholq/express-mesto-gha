const {User} = require("../models/users");
const {NODE_ENV, JWT_SECRET} = process.env;

const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const DataError = require("../errors/data-error");
const AuthError = require("../errors/auth-error");

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then(hash => User.create({ name, about, avatar, email, password: hash }))
      .then(({_id, name, about, avatar, email}) => {
        res.send({ _id, name, about, avatar, email });
      })
      .catch(next);
  } else {
     next(new DataError('Некорректные данные'));
  }
};

module.exports.login = (req, res, next) => {
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
          sameSite: true
        })
        .end();
    })
    .catch((err) => {
      next(new AuthError(err.message))
    });
};