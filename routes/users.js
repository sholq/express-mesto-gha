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
    avatar: Joi.string().required(),
  })
}), updateAvatar);

usersRouter.get('/:userId', getUser);

module.exports = { usersRouter };
