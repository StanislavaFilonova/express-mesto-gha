/* Задание:
   GET /cards — возвращает все карточки
   POST /cards — создаёт карточку
   DELETE /cards/:cardId — удаляет карточку по идентификатору
   PUT /cards/:cardId/likes — поставить лайк карточке
   DELETE /cards/:cardId/likes — убрать лайк с карточки
*/

// const BadRequestError = require('../errors/BadRequestError');
// const NotFoundError = require('../errors/NotFoundError');
// const ForbiddenError = require('../errors/ForbiddenError');
const mongoose = require('mongoose');
const Card = require('../models/card');

// GET /cards — возвращает все карточки
const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => res.status(500).send({ data: err.message }));

// POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Возникла ошибка ${err.message}` });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  // проверка: если карточка по параметрам подходит, то  удалим ее
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (card == null) {
          res.status(404).send({ message: 'Карточка с данным Id не найдена' });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch((err) => res.status(500).send({ data: err.message }));
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки.' });
  }
  // Card.findById(req.params.cardId)
  //   .then((cards) => {
  //     if (!cards) {
  //       throw new NotFoundError('Карточка с указанным _id не найдена.');
  //     } else if (req.user._id !== cards.owner.toString()) {
  //       throw new ForbiddenError('Попытка удалить чужую карточку.');
  //     } else {
  //       Card.deleteOne(cards).then(() => res.status(200).send(cards));
  //     }
  //   })
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
  //     } else {
  //       next(err);
  //     }
  //   });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
const likeCard = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .then((card) => {
        if (card == null) {
          res.status(404).send({ message: 'Карточка с данным Id не найдена' });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch((err) => res.status(500).send({ message: `Возникла ошибка ${err.message}` }));
  } else {
    res.status(400).send({ message: 'Введен некорректный id карточки' });
  }
  // Card.findByIdAndUpdate(
  //   req.params.cardId,
  //   { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  //   { new: true, runValidators: true },
  // )
  // .then((card) => res.status(200).send(card))
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     next(
  //       new BadRequestError(
  //         'Переданы некорректные данные для постановки лайка.',
  //       ),
  //     );    //   } else if (err.message === 'Error') {
  //     next(new NotFoundError('Карточка с указанным _id не найдена.'));
  //   } else {
  //     next(err);
  //   }
  // });
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
const dislikeCard = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .then((card) => {
        if (card == null) {
          res.status(404).send({ message: 'Карточка с данным Id не найдена' });
        } else {
          res.status(200).send({ data: card });
        }
      })
      .catch((err) => res.status(500).send({ message: `Возникла ошибка ${err.message}` }));
  } else {
    res.status(400).send({ message: 'Введен некорректный id карточки' });
  }
  // Card.findByIdAndUpdate(
  //   req.params.cardId,
  //   { $pull: { likes: req.user._id } }, // убрать _id из массива
  //   { new: true, runValidators: true },
  // )
  //   .then((card) => res.status(200).send(card))
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       next(
  //         new BadRequestError('Переданы некорректные данные для снятия лайка.'),
  //       );
  //     } else if (err.message === 'Error') {
  //       next(new NotFoundError('Карточка с указанным _id не найдена.'));
  //     } else {
  //       next(err);
  //     }
  //   });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
