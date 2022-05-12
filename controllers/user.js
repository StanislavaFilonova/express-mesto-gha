/*  Задание:
   GET    /users — возвращает всех пользователей
   GET    /users/:userId - возвращает пользователя по _id
   POST /users — создаёт пользователя
   PATCH  /users/me — обновляет профиль
   PATCH  /users/me/avatar — обновляет аватар профиля
*/

const mongoose = require('mongoose');
const User = require('../models/user');

// GET /users — возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ data: err.message }));
};

// GET /users/me — возвращает информацию о текущем пользователе
const getCurrentUser = (req, res) => {
  // Запустим проверку валидности параметров
  if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user == null) {
          res.status(404).send({ message: 'Пользователь с данным Id не найден' });
        } else {
          res.status(200).send({ data: user });
        }
      })
      .catch((err) => {
        res.status(500).send({ data: err.message });
      });
  } else {
    res.status(400).send({ message: 'Введен некорректный id' });
  }
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с данным Id не найден' });
      } else { res.send({ data: user }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Возникла ошибка ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// POST /users — создаёт пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Возникла ошибка ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// PATCH /users/me — обновляет профиль
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ data: 'Пользователь с данным Id не найден' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Возникла ошибка ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// PATCH /users/me/avatar — обновляет аватар профиля
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true, upsert: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ data: 'Пользователь с данным Id не найден' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Возникла ошибка ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
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
