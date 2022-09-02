const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { errors } = require('celebrate');

const { ERR_DEFAULT } = require('./const/errors');
const NotFound = require('./errors/not-found');

const { login, createUser } = require('./controllers/users');
const { loginValidationSchema, createUserValidationSchema } = require('./middlewares/validators');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan('tiny'));

app.post('/signin', loginValidationSchema, login);
app.post('/signup', createUserValidationSchema, createUser);

app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use(auth);

app.use('/', userRouter);
app.use('/', cardsRouter);

app.use('*', () => {
  throw new NotFound('Запрашиваемый URL не существует');
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERR_DEFAULT, message } = err;

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
