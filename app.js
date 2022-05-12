const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

app.use(bodyParser.json()); // Собирание json
app.use(bodyParser.urlencoded({ extended: true })); // Приём страниц внутри Post-запроса

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '627773418c711608ed9eeb04',
  };
  next();
});

// const NotFoundError = require('./errors/NotFoundError');

// const errorHandler = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
//   res.status(statusCode).send({ message });
//   next();
// };

app.use(usersRoute);
app.use(cardsRoute);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// app.use(errors());
// app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
