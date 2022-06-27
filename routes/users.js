const { celebrate, Joi } = require('celebrate');

const usersRouter = require('express').Router();

const {
  getUsers, getUser, updateProfile, updateAvatar, getProfile,
} = require('../controllers/users');

const { urlRegEx } = require('../regex/regex');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getProfile);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlRegEx),
  }),
}), updateAvatar);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

module.exports = { usersRouter };
