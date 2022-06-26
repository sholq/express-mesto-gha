const usersRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateProfile, updateAvatar, getProfile
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getProfile);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  })
}), updateProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/http(s?)\:\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+(\/[0-9a-zA-Z\-._~:\/?#\]@!$&'()*\+,;=]+#?)?/),
  })
}), updateAvatar);

usersRouter.get('/:userId', getUser);

module.exports = { usersRouter };
