const Card = require('../models/card');
const NotFound = require('../errors/not-found');
const BadRequest = require('../errors/bad-request');

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  if (!name || !link) {
    throw new BadRequest('Переданы некорректные данные при создании карточки');
  }

  Card.create({ name, link, owner })
    .then((card) => res.send({
      data: {
        _id: card._id,
        name: card.name,
        link: card.link,
      },
    }))
    .catch(next);
};

module.exports.getCards = (_req, res, next) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с таким id не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFound('Карточка с таким id не найдена');
  })
  .then((likes) => res.send({ data: likes }))
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFound('Карточка с таким id не найдена');
  })
  .then((likes) => res.send({ data: likes }))
  .catch(next);
