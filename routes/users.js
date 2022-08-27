const { Router } = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const usersRouter = Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);

usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateUserAvatar);

usersRouter.post('/users', createUser);

module.exports = usersRouter;
