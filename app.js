const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.use(usersRoute);
app.use(cardsRoute);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
