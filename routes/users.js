const { Router } = require('express');
const {
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');
const {
  idValidationSchema,
  updateUserInfoValidationSchema,
  updateAvatarValidationSchema,
} = require('../middlewares/validators');

const usersRouter = Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getUserInfo);
usersRouter.get('/users/:_id', idValidationSchema, getUserById);

usersRouter.patch('/users/me', updateUserInfoValidationSchema, updateUser);
usersRouter.patch('/users/me/avatar', updateAvatarValidationSchema, updateUserAvatar);

module.exports = usersRouter;
