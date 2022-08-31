const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const ConflictError = require('../errors/conflict-error');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.checkUserPassword(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        });
    })
    .catch(next);
};

module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    throw new BadRequest('Передан некорректный идентификатор');
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  if (!ObjectId.isValid(userId)) {
    throw new BadRequest('Передан некорректный идентификатор');
  }

  User.findById(userId)
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
