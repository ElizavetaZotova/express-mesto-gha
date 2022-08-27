const User = require('../models/user');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  if (!name || !about || !avatar) {
    throw new BadRequest('Переданы некорректные данные при создании пользователя');
  }

  User.create({
    name, about, avatar,
  })
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch(next);
};

module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!name || !about) {
    throw new BadRequest('Переданы некорректные данные при обновлении профиля');
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }

      return User.findByIdAndUpdate(userId, { name, about });
    })
    .then(() => User.findById(userId))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!avatar) {
    throw new BadRequest('Переданы некорректные данные при обновлении аватара');
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }

      return User.findByIdAndUpdate(userId, { avatar });
    })
    .then(() => User.findById(userId))
    .then((user) => res.send({ data: user }))
    .catch(next);
};
