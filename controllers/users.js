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
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка', err }));
};