const Card = require('../models/card');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({
      data: {
        _id: card._id,
        name: card.name,
        link: card.link,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(err.message));
      }

      next(err);
    });
};

module.exports.getCards = (_req, res, next) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

module.exports.deleteCardById = (req, res, next) => {
  const userId = req.user._id;
  const { _id: cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .catch(() => {
      throw new NotFound('Карточка с таким id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Недостаточно прав');
      }

      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { _id: cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { _id: cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка с таким id не найдена');
    })
    .then((likes) => res.send({ data: likes }))
    .catch(next);
};
