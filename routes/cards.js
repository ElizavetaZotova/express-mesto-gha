const { Router } = require('express');
const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');
const {
  idValidationSchema,
  cardValidationSchema,
} = require('../middlewares/validators');

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);

cardsRouter.delete('/cards/:_id', idValidationSchema, deleteCardById);
cardsRouter.delete('/cards/:_id/likes', idValidationSchema, dislikeCard);

cardsRouter.post('/cards', cardValidationSchema, createCard);

cardsRouter.put('/cards/:_id/likes', idValidationSchema, likeCard);

module.exports = cardsRouter;
