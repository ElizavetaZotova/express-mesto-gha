const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { ERR_DEFAULT } = require('./const/errors');
const NotFound = require('./errors/not-found');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('tiny'));

app.use((req, res, next) => {
  req.user = {
    _id: '63023b6aa0be64f20694d696',
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardsRouter);

app.use('*', () => {
  throw new NotFound('Запрашиваемый URL не существует');
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((err, req, res, next) => {
  const { statusCode = ERR_DEFAULT, message } = err;
console.log(err);
  res
    .status(statusCode)
    .send({
      message: statusCode === ERR_DEFAULT
        ? 'Ошибка сервера. Попробуйте позже'
        : message,
    });
  next();
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`));
