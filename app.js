const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

// const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

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

app.use(express.json()); // Собирание json
app.use(express.urlencoded({ extended: true })); // Приём страниц внутри Post-запроса

app.use(usersRoute);
app.use(cardsRoute);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Роутер не найден' });
});
app.use(errors());

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
