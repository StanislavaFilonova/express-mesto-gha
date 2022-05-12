/*  Задание:
   GET    /users — возвращает всех пользователей
   GET    /users/:userId - возвращает пользователя по _id
   POST /users — создаёт пользователя
   PATCH  /users/me — обновляет профиль
   PATCH  /users/me/avatar — обновляет аватар профиля
*/

const mongoose = require('mongoose');
const User = require('../models/user');

// const BadRequestError = require('../errors/BadRequestError');
// const NotFoundError = require('../errors/NotFoundError');

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
  // User.findById(req.user._id)
  //   .then((user) => res.status(200).send(user))
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       next(new BadRequestError('Ошибка при запросе.'));
  //     } else if (err.message === 'NotFound') {
  //       next(new NotFoundError('Пользователь по указанному _id не найден.'));
  //     } else {
  //       next(err);
  //     }
  //   });
};

// // GET /users/:userId - возвращает пользователя по _id
// const getUserById = (req, res, next) => {
//   User.findById(req.params.userId)
//     .orFail(() => {
//       next(new NotFoundError('_id Ошибка. Пользователь не найден, попробуйте еще раз'));
//     })
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         throw (new NotFoundError('_id Ошибка. Пользователь не найден, попробуйте еще раз'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return
//      next(new BadRequestError(`_id Ошибка. ${req.params} Введен некорректный id пользователя`));
//       }
//       return next(err);
//     });
// };
// возвращает пользователя по _id
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
  // .then((user) => res.status(200).send(user))
  // .catch((err) => {
  //   if (err.message === 'Error') {
  //     next(new NotFoundError('Пользователь не найден.'));
  //   } else if (err.name === 'ValidationError') {
  //     next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
  //   } else {
  //     next(err);
  //   }
  // });
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

  // User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  //   .then((user) => res.status(200).send(user))
  //   .catch((err) => {
  //     if (err.message === 'Error') {
  //       next(new NotFoundError('Пользователь не найден.'));
  //     } else if (err.name === 'ValidationError') {
  //       next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
  //     } else {
  //       next(err);
  //     }
  //   });
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
