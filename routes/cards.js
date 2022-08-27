const { Router } = require('express');
const {
  getCards,
  deleteCardById,
  createCard,
  dislikeCard,
  likeCard,
} = require('../controllers/cards');

const cardsRouter = Router();

cardsRouter.get('/cards', getCards);

cardsRouter.delete('/cards/:cardId', deleteCardById);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

cardsRouter.post('/cards', createCard);

cardsRouter.put('/cards/:cardId/likes', likeCard);

module.exports = cardsRouter;
