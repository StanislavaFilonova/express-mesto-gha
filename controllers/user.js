/*  Задание:
   GET    /users — возвращает всех пользователей
   GET    /users/:userId - возвращает пользователя по _id
   POST /users — создаёт пользователя
   PATCH  /users/me — обновляет профиль
   PATCH  /users/me/avatar — обновляет аватар профиля
*/

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера.' }));
};

// GET /users/me — возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка при запросе.'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundError('_id Ошибка. Пользователь не найден, попробуйте еще раз'));
    })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw (new NotFoundError('_id Ошибка. Пользователь не найден, попробуйте еще раз'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`_id Ошибка. ${req.params} Введен некорректный id пользователя`));
      }
      return next(err);
    });
};

// POST /users — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user.toJSON()))
    .catch((err) => next(err));
};

// PATCH /users/me — обновляет профиль
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Error') {
        next(new NotFoundError('Пользователь не найден.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар профиля
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Error') {
        next(new NotFoundError('Пользователь не найден.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
};
