const usersRouter = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, getProfile
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getProfile);

usersRouter.patch('/me', updateProfile);

usersRouter.patch('/me/avatar', updateAvatar);

usersRouter.get('/:userId', getUser);

module.exports = { usersRouter };
